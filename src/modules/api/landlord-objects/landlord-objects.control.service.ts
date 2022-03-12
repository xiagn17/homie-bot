import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerService } from '../../logger/logger.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
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
import { LandlordObjectsRepository } from './repositories/landlord-objects.repository';
import { ApproveLandlordObjectDto } from './dto/landlord-objects.dto';
import { ApiObjectResponse } from './interfaces/landlord-objects.type';

@Injectable()
export class LandlordObjectsControlService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private telegramBotService: TelegramBotService,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,

    private tasksSchedulerService: TasksSchedulerService,

    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async notificationApproveLandlordObject(object: ApiObjectResponse): Promise<void> {
    const adminEntity = await this.telegramBotService.getAdmin();
    await this.eventEmitter.emitAsync(
      BROADCAST_MODERATION_TO_ADMIN_EVENT_NAME,
      new BroadcastModerationToAdminEvent({
        object: object,
        chatId: adminEntity.chatId,
      }),
    );
  }

  public async controlApprove(approveLandlordObjectDto: ApproveLandlordObjectDto): Promise<void> {
    if (!approveLandlordObjectDto.isApproved) {
      await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .forceDeleteObject(approveLandlordObjectDto.id);
    }

    await this.connection
      .getCustomRepository(LandlordObjectsRepository)
      .approveObject(approveLandlordObjectDto.id);

    const landlordObject = await this.connection
      .getCustomRepository(LandlordObjectsRepository)
      .getFullObject(approveLandlordObjectDto.id);
    await this.objectMatchesForLandlordService.matchObjectToRenters(landlordObject);

    if (!landlordObject.isAdmin) {
      await this.eventEmitter.emitAsync(
        BROADCAST_MODERATION_DECISION_TO_LANDLORD_EVENT_NAME,
        new BroadcastModerationDecisionToLandlordEvent({
          isApproved: approveLandlordObjectDto.isApproved,
          chatId: landlordObject.telegramUser.chatId,
        }),
      );

      await this.tasksSchedulerService.setTaskLandlordRenewNotification({
        landlordObjectId: approveLandlordObjectDto.id,
      });
    }
  }
}
