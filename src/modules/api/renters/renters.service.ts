import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessAnalyticsFieldsEnumType } from '../analytics/interfaces/analytics.type';
import { ObjectMatchesForRenterService } from '../landlord-renter-matches/object-matches.for-renter.service';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { RentersRepository } from './repositories/renters.repository';
import { RenterEntity } from './entities/Renter.entity';
import { RentersSerializer } from './renters.serializer';
import { CreateRenterDTO } from './dto/renters.dto';
import { RenterSettingsRepository } from './repositories/renter-settings.repository';
import { RenterFiltersRepository } from './repositories/renter-filters.repository';

@Injectable()
export class RentersService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private rentersSerializer: RentersSerializer,
    private flowXoService: FlowXoService,

    private objectMatchesForRenterService: ObjectMatchesForRenterService,
    private analyticsService: AnalyticsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getRenter(id: string, entityManager: EntityManager = this.connection.manager): Promise<RenterEntity> {
    return entityManager.getCustomRepository(RentersRepository).getFullRenter(id);
  }

  public async getRenterByChatId(chatId: string): Promise<{ renter?: RenterEntity }> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    return { renter: renter ? renter : undefined };
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

      const renterDbData = this.rentersSerializer.mapToDbData({
        renterDto,
        telegramUser,
      });

      const renter = await manager.getCustomRepository(RentersRepository).createWithRelations(renterDbData);
      await manager
        .getCustomRepository(RenterSettingsRepository)
        .createWithRelations({ renterId: renter.id });
      await manager.getCustomRepository(RenterFiltersRepository).createWithRelations({ renterId: renter.id });

      return manager.getCustomRepository(RentersRepository).getFullRenter(renter.id);
    });

    await this.analyticsService.changeStatus({
      chatId: renterDto.chatId,
      field: BusinessAnalyticsFieldsEnumType.end_fill_renter_info,
    });
    await this.objectMatchesForRenterService.matchRenterToObjects(renter);

    return renter;
  }

  public async addPaidContacts(
    telegramUserId: string,
    count: number,
    entityManager: EntityManager,
  ): Promise<void> {
    await entityManager.getCustomRepository(RenterSettingsRepository).addContacts(telegramUserId, count);
    const telegramUser = await entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOneOrFail({ id: telegramUserId });
    await this.flowXoService.notificationPaidContacts({
      chatId: telegramUser.chatId,
      botId: telegramUser.botId,
    });
  }

  public async removeContact(renterId: string): Promise<void> {
    await this.connection.getCustomRepository(RenterSettingsRepository).removeContact(renterId);
  }
}
