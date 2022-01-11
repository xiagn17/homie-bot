import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { RenterEntity } from '../renters/entities/Renter.entity';
import { RentersRepository } from '../renters/repositories/renters.repository';
import { SubwayStationsRepository } from '../directories/repositories/subwayStations.repository';
import { MoneyRangesRepository } from '../directories/repositories/moneyRanges.repository';
import { LocationsRepository } from '../directories/repositories/locations.repository';
import { MatchesInfoRepository } from '../renters/repositories/matchesInfo.repository';
import { MatchesInfoEntity } from '../renters/entities/MatchesInfo.entity';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessAnalyticsFieldsEnumType } from '../analytics/interfaces/analytics.type';
import { RenterMatchEntity } from './entities/RenterMatch.entity';
import { RenterMatchesRepository } from './repositories/renterMatches.repository';
import {
  ApiRenterStartMatchesResponse,
  MatchStatusEnumType,
  RenterStartMatchesStatus,
} from './interfaces/renter-matches.type';
import { RenterMatchesSerializer } from './renter-matches.serializer';
import { RenterMatchesChangeStatusDTO } from './dto/renter-matches.dto';

@Injectable()
export class RenterMatchesService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,
    private flowXoService: FlowXoService,
    private renterMatchesSerializer: RenterMatchesSerializer,
    private analyticsService: AnalyticsService,
    private configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async startMatchingRenter(chatId: string): Promise<ApiRenterStartMatchesResponse> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (!renter) {
      throw new Error(`No renter by chatId = ${chatId}`);
    }

    const processingMatch = await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .getProcessingMatch(renter.id);
    if (processingMatch) {
      const matchedRenters = await Promise.all([
        this.entityManager.getCustomRepository(RentersRepository).getFullRenter(processingMatch.firstId),
        this.entityManager.getCustomRepository(RentersRepository).getFullRenter(processingMatch.secondId),
      ]);
      const matchData = this.renterMatchesSerializer.prepareMatchData(matchedRenters, processingMatch);
      const dataForOutRenter = matchData.filter(d => d.targetChatId === chatId)[0];

      await this.flowXoService.sendMessageWithMatch(dataForOutRenter, true);
      return {
        status: RenterStartMatchesStatus.fail,
      };
    }

    const matchesInfo = await this.entityManager
      .getCustomRepository(MatchesInfoRepository)
      .getMatchesInfoByRenterId(renter.id);

    if (matchesInfo.ableMatches === 0) {
      await this.flowXoService.sendRenterToMatchPayment(chatId, renter.telegramUser.botId);
      return { status: RenterStartMatchesStatus.fail };
    } else {
      await this.entityManager.getCustomRepository(MatchesInfoRepository).startSearching(renter.id);
    }

    const matchedRenters = await this.findMatchesForRenter(renter);
    if (matchedRenters[0]) {
      await this.processMatch(renter, matchedRenters[0]);
      this.logger.info(
        `Match between renter (ids) ${matchedRenters[0].id} and ${matchedRenters[1].id} is created!`,
      );
      return {
        status: RenterStartMatchesStatus.redirected,
      };
    }

    return { status: RenterStartMatchesStatus.ok };
  }

  public async changeMatchStatus(data: RenterMatchesChangeStatusDTO): Promise<void> {
    await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .changeMatchStatus(data.matchId, data.status);
    if (data.status === MatchStatusEnumType.resolved) {
      await this.analyticsService.changeStatus({
        chatId: data.chatId,
        field: BusinessAnalyticsFieldsEnumType.success_match,
      });
    }
  }

  public async addPaidMatches(chatId: string): Promise<MatchesInfoEntity> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (!renter) {
      throw new Error(`Add Paid matches failed at user with chatId = ${chatId}. He has not Renter`);
    }
    const matchesInfo = await this.entityManager.getCustomRepository(MatchesInfoRepository).findOneOrFail({
      renterId: renter.id,
    });
    const matchesCountToAdd = this.configService.get('renterMatches.paidMatchesCount') as number;
    return this.entityManager
      .getCustomRepository(MatchesInfoRepository)
      .addAbleMatches(matchesInfo, matchesCountToAdd);
  }

  public async stopMatchingRenter(chatId: string): Promise<void> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (renter) {
      await this.entityManager.getCustomRepository(MatchesInfoRepository).stopSearching(renter.id);
    }
  }

  private async findMatchesForRenter(
    renter: RenterEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<RenterEntity[]> {
    const subwayStationIdsForMatch = await entityManager
      .getCustomRepository(SubwayStationsRepository)
      .getStationIdsForMatch(renter.subwayStations);
    const moneyRangeIdsForMatch = await entityManager
      .getCustomRepository(MoneyRangesRepository)
      .getMoneyRangeIdsForRenterMatch(renter.moneyRange);
    const locationIdsForMatch = await entityManager
      .getCustomRepository(LocationsRepository)
      .getLocationIdsForMatch(renter.location);
    const renterMatchesToExclude = await entityManager
      .getCustomRepository(RenterMatchesRepository)
      .findResolvedRejectedMatches(renter.id);
    const renterIdsToExcludeFromMatch = renterMatchesToExclude
      .map(renterMatch => (renterMatch.firstId === renter.id ? renterMatch.secondId : renterMatch.firstId))
      .concat(renter.id);

    const matchOptions = {
      moneyRangeIds: moneyRangeIdsForMatch,
      locationIds: locationIdsForMatch,
      subwayStationIds: subwayStationIdsForMatch,
      renterIdsToExclude: renterIdsToExcludeFromMatch,
    };

    const matchedRenters = await entityManager
      .getCustomRepository(RentersRepository)
      .findMatchesRenterToRenter(renter, matchOptions);

    return matchedRenters;
  }

  private async processMatch(renter: RenterEntity, matchedRenter: RenterEntity): Promise<RenterMatchEntity> {
    const processingMatch = await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .createMatch(renter, matchedRenter, MatchStatusEnumType.processing);

    const matchedRenters = await Promise.all([
      this.entityManager.getCustomRepository(RentersRepository).getFullRenter(processingMatch.firstId),
      this.entityManager.getCustomRepository(RentersRepository).getFullRenter(processingMatch.secondId),
    ]);
    const matchData = this.renterMatchesSerializer.prepareMatchData(matchedRenters, processingMatch);

    await Promise.all(matchData.map(data => this.flowXoService.sendMessageWithMatch(data, false)));

    const renterMatchesInfo = await Promise.all([
      this.entityManager.getCustomRepository(MatchesInfoRepository).findOneOrFail({
        renterId: matchedRenters[0].id,
      }),
      this.entityManager.getCustomRepository(MatchesInfoRepository).findOneOrFail({
        renterId: matchedRenters[1].id,
      }),
    ]);

    await Promise.all(
      matchedRenters.map(r =>
        this.analyticsService.changeStatus({
          chatId: r.telegramUser.chatId,
          field: BusinessAnalyticsFieldsEnumType.created_match,
        }),
      ),
    );
    await Promise.all(
      renterMatchesInfo.reduce<Promise<any>[]>((acc, info) => {
        acc.push(this.entityManager.getCustomRepository(MatchesInfoRepository).stopSearching(info.renterId));
        acc.push(this.entityManager.getCustomRepository(MatchesInfoRepository).decreaseAbleMatches(info));
        return acc;
      }, []),
    );

    return processingMatch;
  }
}
