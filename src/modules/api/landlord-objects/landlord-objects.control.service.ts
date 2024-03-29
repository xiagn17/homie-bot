import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerService } from '../../logger/logger.service';
import { ObjectMatchesForLandlordService } from '../landlord-renter-matches/object-matches.for-landlord.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import {
  BROADCAST_MODERATION_DECISION_TO_LANDLORD_EVENT_NAME,
  BroadcastModerationDecisionToLandlordEvent,
} from '../../bot/broadcast/events/broadcast-moderation-decision-landlord.event';
import {
  BROADCAST_MODERATION_TO_ADMIN_EVENT_NAME,
  BroadcastModerationToAdminEvent,
} from '../../bot/broadcast/events/broadcast-moderation-admin.event';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { RentersService } from '../renters/renters.service';
import { RenterReferralsEnum } from '../renters/interfaces/renter-referrals.interface';
import { LandlordObjectsRepository } from './repositories/landlord-objects.repository';
import { ApproveLandlordObjectDto } from './dto/landlord-objects.dto';
import { ApiObjectResponse } from './interfaces/landlord-objects.type';

@Injectable()
export class LandlordObjectsControlService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,

    private readonly tasksSchedulerService: TasksSchedulerService,
    private readonly rentersService: RentersService,

    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async notificationApproveLandlordObject(object: ApiObjectResponse): Promise<void> {
    const adminEntity = await this.connection.getCustomRepository(TelegramUsersRepository).getAdmin();
    await this.eventEmitter.emitAsync(
      BROADCAST_MODERATION_TO_ADMIN_EVENT_NAME,
      new BroadcastModerationToAdminEvent({
        object: object,
        chatId: adminEntity.chatId,
      }),
    );
  }

  public async controlApprove(approveLandlordObjectDto: ApproveLandlordObjectDto): Promise<void> {
    return this.connection.transaction(async entityManager => {
      if (!approveLandlordObjectDto.isApproved) {
        await entityManager
          .getCustomRepository(LandlordObjectsRepository)
          .softDeleteObject(approveLandlordObjectDto.id);
        return;
      }

      await entityManager
        .getCustomRepository(LandlordObjectsRepository)
        .approveObject(approveLandlordObjectDto.id);
      await entityManager
        .getCustomRepository(LandlordObjectsRepository)
        .renewObject(approveLandlordObjectDto.id);

      const landlordObject = await entityManager
        .getCustomRepository(LandlordObjectsRepository)
        .getFullObject(approveLandlordObjectDto.id);
      await this.objectMatchesForLandlordService.matchObjectToRenters(landlordObject, entityManager);

      if (!landlordObject.isAdmin) {
        await this.tasksSchedulerService.setTaskLandlordRenewNotification(
          landlordObject,
          undefined,
          entityManager,
        );
        await this.eventEmitter.emitAsync(
          BROADCAST_MODERATION_DECISION_TO_LANDLORD_EVENT_NAME,
          new BroadcastModerationDecisionToLandlordEvent({
            isApproved: approveLandlordObjectDto.isApproved,
            chatId: landlordObject.telegramUser.chatId,
          }),
        );

        await this.checkAndAddBonusContactsOnApprove(
          landlordObject.telegramUser.referralUserId,
          landlordObject.telegramUserId,
          entityManager,
        );
      }
    });
  }

  public async checkAndAddBonusContactsOnApprove(
    referralUserId: string | null,
    telegramUserId: string,
    entityManager: EntityManager,
  ): Promise<void> {
    if (!referralUserId) {
      return;
    }
    const count = await entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .countOfApprovedObjects(telegramUserId);
    const firstApprovedObject = count === 1;
    if (!firstApprovedObject) {
      return;
    }
    await this.rentersService.depositReferralContacts(
      referralUserId,
      RenterReferralsEnum.onFillLandlordObject,
      entityManager,
    );
  }

  public async makeObjectStarred(objectId: string): Promise<void> {
    await this.connection.getCustomRepository(LandlordObjectsRepository).update(objectId, {
      starred: true,
    });
  }
}
