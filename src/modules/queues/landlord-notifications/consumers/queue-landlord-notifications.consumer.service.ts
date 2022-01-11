import { OnQueueCleaned, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggerService } from '../../../logger/logger.service';
import { LandlordObjectsRepository } from '../../../api/landlord-objects/repositories/landlord-objects.repository';
import { FlowXoService } from '../../../flow-xo/flow-xo.service';
import {
  LANDLORD_NOTIFICATIONS_QUEUE_NAME,
  NOTIFICATION_RENEW_OBJECT,
} from '../queue-landlord-notifications.constants';
import { ToUpdateObjectJobDataType } from '../queue-landlord-notifications.types';

@Processor(LANDLORD_NOTIFICATIONS_QUEUE_NAME)
@Injectable()
export class QueueLandlordNotificationsConsumerService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,
    private flowXoService: FlowXoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @OnQueueError()
  onError(error: Error): void {
    this.logger.error(`Queue error: ${error.message}`);
  }

  @OnQueueFailed()
  onFailure(job: Job, err: Error): void {
    this.logger.error(`${job.id} failed with "${err.message}"`);
  }

  @OnQueueCleaned()
  onCleaned(): void {
    this.logger.info('The queue was successfully served');
  }

  @Process(NOTIFICATION_RENEW_OBJECT)
  async onNotificationRenewObject(job: Job<ToUpdateObjectJobDataType>, done: DoneCallback): Promise<void> {
    const id = job.data;
    try {
      const landlordObject = await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .getFullObject(id);
      await this.flowXoService.notificationLandlordRenewObject(landlordObject, landlordObject.telegramUser);
      this.logger.info(`Renew event for landlordObjectId ${id} was sent just now`);
      done();
    } catch (e: any) {
      done(e);
      this.logger.warn(`Sending renew event for landlordObjectId ${id} is delayed for 30 minutes`);
    }
  }
}
