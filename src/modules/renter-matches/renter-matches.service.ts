import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../logger/logger.service';
import { Renter } from '../../entities/users/Renter';
import { RenterMatch } from '../../entities/matches/RenterMatch';
import { RenterMatchesRepository } from '../../repositories/matches/renterMatches.repository';
import { RentersRepository } from '../../repositories/users/renters.repository';
import { SubwayStationsRepository } from '../../repositories/directories/subwayStations.repository';
import { MoneyRangesRepository } from '../../repositories/directories/moneyRanges.repository';
import { LocationsRepository } from '../../repositories/directories/locations.repository';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';
import { SendpulseService } from '../sendpulse/sendpulse.service';
import { MatchesInfoRepository } from '../../repositories/matches/matchesInfo.repository';
import { MatchesInfo } from '../../entities/matches/MatchesInfo';
import { ApiRenterStartMatchesResponse, MatchStatusEnumType } from './renter-matches.type';
import { RenterMatchesSerializer } from './renter-matches.serializer';
import { RenterMatchesChangeStatusDTO } from './renter-matches.dto';

@Injectable()
export class RenterMatchesService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,
    private sendpulseService: SendpulseService,
    private renterMatchesSerializer: RenterMatchesSerializer,
    private configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  // todo на эксепшены перехватывать в интерсепторе и делать обобщенную ошибку на сендпульс
  async startMatchingRenter(chatId: string): Promise<ApiRenterStartMatchesResponse> {
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

      await this.sendpulseService.sendMessageWithMatch(dataForOutRenter, true);
      return { success: false, error: 'already match exists' };
    }

    const trialMatchesCount = this.configService.get('renterMatches.trialMatchesCount') as number;
    const matchesInfo =
      (await this.entityManager
        .getCustomRepository(MatchesInfoRepository)
        .getMatchesInfoByRenterId(renter.id)) ??
      (await this.entityManager
        .getCustomRepository(MatchesInfoRepository)
        .createInfo(renter.id, trialMatchesCount));

    if (matchesInfo.ableMatches === 0) {
      await this.sendpulseService.sendRenterToMatchPayment(chatId);
      return { success: false, error: 'need payment' };
    } else {
      await this.entityManager.getCustomRepository(MatchesInfoRepository).startSearching(renter.id);
    }

    const matchedRenters = await this.findMatchesForRenter(renter);
    this.logger.log('success create matches', matchedRenters);
    if (matchedRenters[0]) {
      await this.processMatch(renter, matchedRenters[0]);
      return { success: true, error: 'match_has_found' };
    }

    return { success: true, error: 'good' };
  }

  public async changeMatchStatus(data: RenterMatchesChangeStatusDTO): Promise<void> {
    await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .changeMatchStatus(data.matchId, data.status);
  }

  public async addPaidMatches(chatId: string): Promise<MatchesInfo> {
    const { renter } = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .getUserByChatId(chatId);
    const matchesInfo = await this.entityManager.getCustomRepository(MatchesInfoRepository).findOneOrFail({
      renterId: renter.id,
    });
    const matchesCountToAdd = this.configService.get('renterMatches.paidMatchesCount') as number;
    return this.entityManager
      .getCustomRepository(MatchesInfoRepository)
      .addAbleMatches(matchesInfo, matchesCountToAdd);
  }

  public async stopMatchingRenter(renterId: string): Promise<void> {
    await this.entityManager.getCustomRepository(MatchesInfoRepository).stopSearching(renterId);
  }

  private async findMatchesForRenter(
    renter: Renter,
    entityManager: EntityManager = this.entityManager,
  ): Promise<Renter[]> {
    const subwayStationIdsForMatch = await entityManager
      .getCustomRepository(SubwayStationsRepository)
      .getRenterStationIdsForMatch(renter.subwayStations);
    const moneyRangeIdsForMatch = await entityManager
      .getCustomRepository(MoneyRangesRepository)
      .getMoneyRangeIdsForMatch(renter.moneyRange);
    const locationIdsForMatch = await entityManager
      .getCustomRepository(LocationsRepository)
      .getRenterLocationIdsForMatch(renter.location);
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
      .findMatchesForRenter(renter, matchOptions);

    return matchedRenters;
  }

  private async processMatch(renter: Renter, matchedRenter: Renter): Promise<RenterMatch> {
    const processingMatch = await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .createMatch(renter, matchedRenter, MatchStatusEnumType.processing);

    const matchedRenters = await Promise.all([
      this.entityManager.getCustomRepository(RentersRepository).getFullRenter(processingMatch.firstId),
      this.entityManager.getCustomRepository(RentersRepository).getFullRenter(processingMatch.secondId),
    ]);
    const matchData = this.renterMatchesSerializer.prepareMatchData(matchedRenters, processingMatch);

    await Promise.all(matchData.map(data => this.sendpulseService.sendMessageWithMatch(data, false)));

    const renterMatchesInfo = await Promise.all([
      this.entityManager.getCustomRepository(MatchesInfoRepository).findOneOrFail({
        renterId: matchedRenters[0].id,
      }),
      this.entityManager.getCustomRepository(MatchesInfoRepository).findOneOrFail({
        renterId: matchedRenters[1].id,
      }),
    ]);

    await Promise.all(
      renterMatchesInfo.reduce<Promise<any>[]>((acc, info) => {
        acc.push(this.stopMatchingRenter(info.renterId));
        acc.push(this.entityManager.getCustomRepository(MatchesInfoRepository).decreaseAbleMatches(info));
        return acc;
      }, []),
    );

    return processingMatch;
  }
}