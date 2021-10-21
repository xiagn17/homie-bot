import { Injectable } from '@nestjs/common';
import { Any, Connection } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { MoneyRange } from '../../../entities/directories/MoneyRange';
import { Location } from '../../../entities/directories/Location';
import { SubwayStation } from '../../../entities/directories/SubwayStation';
import { Interest } from '../../../entities/directories/Interest';
import { RentersRepository } from '../../../repositories/users/renters.repository';
import { Renter } from '../../../entities/users/Renter';
import { TelegramUser } from '../../../entities/users/TelegramUser';
import { MatchesInfoRepository } from '../../../repositories/matches/matchesInfo.repository';
import { MatchesInfo } from '../../../entities/matches/MatchesInfo';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessAnalyticsFieldsEnumType } from '../analytics/analytics.type';
import { RentersSerializer } from './renters.serializer';
import { CreateRenterDTO } from './renters.dto';

@Injectable()
export class RentersService {
  constructor(
    private connection: Connection,

    private logger: Logger,

    private rentersSerializer: RentersSerializer,

    private analyticsService: AnalyticsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async getRenterByChatId(
    chatId: string,
  ): Promise<{ renter: Renter; matchesInfo: MatchesInfo | undefined } | undefined> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (!renter) {
      return undefined;
    }
    const matchesInfo = await this.connection
      .getCustomRepository(MatchesInfoRepository)
      .getMatchesInfoByRenterId(renter.id);
    return { renter, matchesInfo };
  }

  public getRenterByPhone(phoneNumber: string): Promise<Renter | undefined> {
    return this.connection.getCustomRepository(RentersRepository).getByPhone(phoneNumber);
  }

  public async createRenter(renterDto: CreateRenterDTO): Promise<Renter> {
    const renter = await this.connection.transaction<Renter>(async manager => {
      const telegramUser = await manager
        .getRepository(TelegramUser)
        .findOneOrFail({ chatId: renterDto.chatId });
      const location = await manager.getRepository(Location).findOneOrFail({ area: renterDto.location });
      const moneyRange = await manager
        .getRepository(MoneyRange)
        .findOneOrFail({ range: renterDto.moneyRange });
      const interests = await manager
        .getRepository(Interest)
        .find({ interest: Any(renterDto.interests ?? []) });
      const subwayStations = await manager
        .getRepository(SubwayStation)
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

      return renter;
    });

    await this.analyticsService.changeStatus({
      chatId: renterDto.chatId,
      field: BusinessAnalyticsFieldsEnumType.end_fill_renter_info,
    });
    return renter;
  }
}
