import { Injectable } from '@nestjs/common';
import { Any, Connection, EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { MoneyRangeEntity } from '../../../entities/directories/MoneyRange.entity';
import { LocationEntity } from '../../../entities/directories/Location.entity';
import { SubwayStationEntity } from '../../../entities/directories/SubwayStation.entity';
import { InterestEntity } from '../../../entities/directories/Interest.entity';
import { RentersRepository } from '../../../repositories/users/renters.repository';
import { RenterEntity } from '../../../entities/renters/Renter.entity';
import { TelegramUserEntity } from '../../../entities/users/TelegramUser.entity';
import { MatchesInfoRepository } from '../../../repositories/matches/matchesInfo.repository';
import { MatchesInfoEntity } from '../../../entities/renters/MatchesInfo.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessAnalyticsFieldsEnumType } from '../analytics/analytics.type';
import { QueueObjectRenterMatchesProducerService } from '../../queues/object-renter-matches/producers/queue-object-renter-matches.producer.service';
import { RentersSerializer } from './renters.serializer';
import { CreateRenterDTO } from './renters.dto';

@Injectable()
export class RentersService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private rentersSerializer: RentersSerializer,

    private queueObjectRenterMatchesService: QueueObjectRenterMatchesProducerService,
    private analyticsService: AnalyticsService,
    private configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getRenter(id: string, entityManager: EntityManager = this.connection.manager): Promise<RenterEntity> {
    return entityManager.getCustomRepository(RentersRepository).getFullRenter(id);
  }

  public async getRenterByChatId(
    chatId: string,
  ): Promise<{ renter: RenterEntity; matchesInfo: MatchesInfoEntity } | undefined> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (!renter) {
      return undefined;
    }
    const matchesInfo = await this.connection
      .getCustomRepository(MatchesInfoRepository)
      .getMatchesInfoByRenterId(renter.id);
    return { renter, matchesInfo };
  }

  public getRenterByPhone(phoneNumber: string): Promise<RenterEntity | undefined> {
    return this.connection.getCustomRepository(RentersRepository).getByPhone(phoneNumber);
  }

  public async isUserRenter(chatId: string): Promise<boolean> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    return !!renter;
  }

  public async createRenter(renterDto: CreateRenterDTO): Promise<RenterEntity> {
    const renter = await this.connection.transaction<RenterEntity>(async manager => {
      const telegramUser = await manager
        .getRepository(TelegramUserEntity)
        .findOneOrFail({ chatId: renterDto.chatId });
      const location = await manager
        .getRepository(LocationEntity)
        .findOneOrFail({ area: renterDto.location });
      const moneyRange = await manager
        .getRepository(MoneyRangeEntity)
        .findOneOrFail({ range: renterDto.moneyRange });
      const interests = await manager
        .getRepository(InterestEntity)
        .find({ interest: Any(renterDto.interests ?? []) });
      const subwayStations = await manager
        .getRepository(SubwayStationEntity)
        .find({ station: Any(renterDto.subwayStations) });

      const renterDbData = this.rentersSerializer.mapToDbData({
        renterDto,
        location,
        moneyRange,
        telegramUser,
      });

      const renter = await manager
        .getCustomRepository(RentersRepository)
        .createWithRelations(renterDbData, { subwayStations, interests });

      const trialMatchesCount = this.configService.get('renterMatches.trialMatchesCount') as number;
      await manager.getCustomRepository(MatchesInfoRepository).createInfo(renter.id, trialMatchesCount);

      return renter;
    });

    await this.analyticsService.changeStatus({
      chatId: renterDto.chatId,
      field: BusinessAnalyticsFieldsEnumType.end_fill_renter_info,
    });
    await this.queueObjectRenterMatchesService.pushJobCreateMatchesForRenter(renter.id);

    return renter;
  }
}
