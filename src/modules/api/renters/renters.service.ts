import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { ObjectMatchesForRenterService } from '../landlord-renter-matches/object-matches.for-renter.service';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import {
  BROADCAST_REFERRAL_DAYS_TO_RENTER_EVENT_NAME,
  BroadcastReferralDaysRenterEvent,
} from '../../bot/broadcast/events/broadcast-referral-days-renter.event';
import { PaymentItemInterface, PaymentItems } from '../payments/interfaces/payment-item.interface';
import {
  BROADCAST_SUBSCRIPTION_START_EVENT_NAME,
  BroadcastSubscriptionStartEvent,
} from '../../bot/broadcast/events/broadcast-subscription-start.event';
import { sendAnalyticsEvent } from '../../../utils/google-analytics/sendAnalyticsEvent';
import {
  RENTER_ACTION,
  RENTER_SUBSCRIPTION_1490,
  RENTER_SUBSCRIPTION_990,
} from '../../../utils/google-analytics/events';
import { RentersRepository } from './repositories/renters.repository';
import { RenterEntity } from './entities/Renter.entity';
import { RentersSerializer } from './serializers/renters.serializer';
import {
  CreateRenterDTO,
  CreateRenterInfoDto,
  UpdateRenterFiltersDto,
  UpdateRenterInfoDto,
} from './dto/renters.dto';
import { RenterSettingsRepository } from './repositories/renter-settings.repository';
import { RenterFiltersRepository } from './repositories/renter-filters.repository';
import { ApiRenterFull } from './interfaces/renters.type';
import { RenterInfosRepository } from './repositories/renter-infos.repository';
import { RenterInfosSerializer } from './serializers/renter-infos.serializer';
import { ApiRenterFullInfo, ApiRenterInfo } from './interfaces/renter-info.interface';
import { ApiRenterFilters } from './interfaces/renter-filters.interface';
import { RenterFiltersSerializer } from './serializers/renter-filters.serializer';
import { RenterReferralsEnum } from './interfaces/renter-referrals.interface';

@Injectable()
export class RentersService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,
    private readonly configService: ConfigService,

    private rentersSerializer: RentersSerializer,
    private renterInfosSerializer: RenterInfosSerializer,
    private renterFiltersSerializer: RenterFiltersSerializer,

    private objectMatchesForRenterService: ObjectMatchesForRenterService,
    private readonly tasksSchedulerService: TasksSchedulerService,

    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getRenter(id: string, entityManager: EntityManager = this.connection.manager): Promise<RenterEntity> {
    return entityManager.getCustomRepository(RentersRepository).getFullRenter(id);
  }

  public async getRenterByChatId(chatId: string): Promise<ApiRenterFull> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    return this.rentersSerializer.toFullResponse(renter);
  }

  public async isUserRenter(chatId: string): Promise<boolean> {
    try {
      await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async createRenter(renterDto: CreateRenterDTO): Promise<RenterEntity> {
    const renter = await this.connection.transaction<RenterEntity>(async manager => {
      const telegramUser = await manager
        .getRepository(TelegramUserEntity)
        .findOneOrFail({ chatId: renterDto.chatId, botId: renterDto.botId });

      const renterDbData = this.rentersSerializer.mapToDbData({
        renterDto,
        telegramUser,
      });

      const { id: renterId } = await manager
        .getCustomRepository(RentersRepository)
        .createWithRelations(renterDbData);
      await manager.getCustomRepository(RenterSettingsRepository).createWithRelations({ renterId });
      await manager.getCustomRepository(RenterFiltersRepository).createWithRelations({ renterId: renterId });

      return manager.getCustomRepository(RentersRepository).getFullRenter(renterId);
    });

    await this.objectMatchesForRenterService.matchRenterToObjects(renter);

    return renter;
  }

  async createInfo(renterInfoDto: CreateRenterInfoDto): Promise<ApiRenterInfo> {
    return this.connection.transaction(async entityManager => {
      const renter = await entityManager
        .getCustomRepository(RentersRepository)
        .getByChatId(renterInfoDto.chatId);
      const dbData = this.renterInfosSerializer.mapToDbData({ renterInfoDto, renter });
      const renterInfoEntity = await entityManager
        .getCustomRepository(RenterInfosRepository)
        .createWithRelations(dbData);
      const { referralUserId } = renter.telegramUser;
      if (referralUserId) {
        await this.depositReferralContacts(
          referralUserId,
          RenterReferralsEnum.onFillRenterInfo,
          entityManager,
        );
      }

      return this.renterInfosSerializer.toResponse(renterInfoEntity);
    });
  }

  async isRenterInfoExists(chatId: string): Promise<boolean> {
    const renter = await this.getRenterByChatId(chatId);
    const renterInfoEntity = await this.connection
      .getCustomRepository(RenterInfosRepository)
      .findOne({ renterId: renter.id });
    return !!renterInfoEntity;
  }

  async getRenterInfo(chatId: string): Promise<ApiRenterFullInfo | undefined> {
    const renter = await this.getRenterByChatId(chatId);
    const renterInfo = await this.connection
      .getCustomRepository(RenterInfosRepository)
      .findOne({ renterId: renter.id });
    return renterInfo && this.renterInfosSerializer.toFullResponse(renterInfo, renter);
  }

  async getRenterInfoById(renterId: string): Promise<ApiRenterFullInfo | undefined> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getFullRenter(renterId);
    const renterResponse = this.rentersSerializer.toFullResponse(renter);
    const renterInfo = await this.connection
      .getCustomRepository(RenterInfosRepository)
      .findOne({ renterId: renter.id });
    return renterInfo && this.renterInfosSerializer.toFullResponse(renterInfo, renterResponse);
  }

  async updateRenterFilters(renterFiltersDto: UpdateRenterFiltersDto): Promise<ApiRenterFilters> {
    return this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(RenterFiltersRepository)
        .update({ renterId: renterFiltersDto.renterId }, renterFiltersDto);

      const renter = await entityManager
        .getCustomRepository(RentersRepository)
        .getFullRenter(renterFiltersDto.renterId);
      await this.objectMatchesForRenterService.recreateMatches(renter, entityManager);

      const filters = await entityManager
        .getCustomRepository(RenterFiltersRepository)
        .findOneOrFail({ renterId: renterFiltersDto.renterId });
      return this.renterFiltersSerializer.toResponse(filters);
    });
  }

  async updateRenterInfo(renterInfoDto: UpdateRenterInfoDto): Promise<void> {
    const { chatId, ...updatingProperties } = renterInfoDto;
    const renter = await this.getRenterByChatId(chatId);
    await this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(RenterInfosRepository)
        .update({ renterId: renter.id }, updatingProperties);
    });
  }

  async getRenterFilters(chatId: string): Promise<ApiRenterFilters> {
    const renter = await this.getRenterByChatId(chatId);
    const filters = await this.connection
      .getCustomRepository(RenterFiltersRepository)
      .findOneOrFail({ renterId: renter.id });
    return this.renterFiltersSerializer.toResponse(filters);
  }

  public async startTrialSubscription(renterId: string): Promise<void> {
    const startedAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(startedAt.getDate() + 1);

    await this.connection
      .getCustomRepository(RenterSettingsRepository)
      .startTrialSubscription(renterId, startedAt, endsAt);
  }

  public async startSubscription(
    telegramUserId: string,
    subscriptionType: PaymentItemInterface,
    entityManager: EntityManager,
  ): Promise<void> {
    const startedAt = new Date();
    const endsAt = new Date();
    subscriptionType === PaymentItems['subscription-1-week']
      ? endsAt.setMonth(startedAt.getDate() + 7)
      : endsAt.setDate(startedAt.getDate() + 14);

    await entityManager
      .getCustomRepository(RenterSettingsRepository)
      .startSubscription(telegramUserId, startedAt, endsAt);
    const telegramUser = await entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOneOrFail({ id: telegramUserId });
    await this.eventEmitter.emitAsync(
      BROADCAST_SUBSCRIPTION_START_EVENT_NAME,
      new BroadcastSubscriptionStartEvent({
        endsAt: endsAt,
        chatId: telegramUser.chatId,
      }),
    );

    if (subscriptionType === PaymentItems['subscription-2-weeks']) {
      sendAnalyticsEvent(telegramUser.chatId, RENTER_ACTION, RENTER_SUBSCRIPTION_990);
    } else if (subscriptionType === PaymentItems['subscription-month']) {
      sendAnalyticsEvent(telegramUser.chatId, RENTER_ACTION, RENTER_SUBSCRIPTION_1490);
    }
  }

  public async stopSearch(chatId: string): Promise<void> {
    await this.connection.transaction(async entityManager => {
      const renter = await entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
      await entityManager.getCustomRepository(RenterSettingsRepository).stopSearch(renter.id);
      await this.tasksSchedulerService.removeTasksAfterStopRenter(renter.id, entityManager);
    });
  }

  public async depositReferralContacts(
    telegramUserId: string,
    from: RenterReferralsEnum,
    entityManager: EntityManager = this.connection.manager,
  ): Promise<void> {
    let days: number = 0;
    if (from === RenterReferralsEnum.onFillRenterInfo) {
      days = this.configService.get('referral.bonusOnFillRenterInfo') as number;
    } else if (from === RenterReferralsEnum.onFillLandlordObject) {
      days = this.configService.get('referral.bonusOnFillLandlordObject') as number;
    }
    const renterSettings = await entityManager
      .getCustomRepository(RenterSettingsRepository)
      .findByTelegramUserId(telegramUserId);
    const isSubscriptionValid =
      renterSettings.subscriptionEnds !== null && renterSettings.subscriptionEnds > new Date();
    const startedAt = isSubscriptionValid ? (renterSettings.subscriptionStarted as Date) : new Date();
    const endsAt = isSubscriptionValid ? (renterSettings.subscriptionEnds as Date) : new Date();
    endsAt.setDate(endsAt.getDate() + days);

    await entityManager
      .getCustomRepository(RenterSettingsRepository)
      .startSubscription(telegramUserId, startedAt, endsAt);

    const telegramUser = await entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOneOrFail(telegramUserId);
    await this.eventEmitter.emitAsync(
      BROADCAST_REFERRAL_DAYS_TO_RENTER_EVENT_NAME,
      new BroadcastReferralDaysRenterEvent({
        from: from,
        chatId: telegramUser.chatId,
      }),
    );
  }
}
