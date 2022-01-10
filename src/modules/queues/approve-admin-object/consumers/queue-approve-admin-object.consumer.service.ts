import { OnQueueCleaned, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger/logger.service';
import { MatchStatusEnumType } from '../../../api/renter-matches/renter-matches.type';
import { ObjectMatchesForLandlordService } from '../../../api/landlord-renter-matches/object-matches.for-landlord.service';
import {
  JOB_APPROVE_ADMIN_OBJECT,
  QUEUE_APPROVE_ADMIN_OBJECT_NAME,
} from '../queue-approve-admin-object.constants';
import { AdminApproveObjectJobDataType } from '../queue-approve-admin-object.types';

@Processor(QUEUE_APPROVE_ADMIN_OBJECT_NAME)
@Injectable()
export class QueueApproveAdminObjectConsumerService {
  constructor(
    private logger: LoggerService,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
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

  @Process(JOB_APPROVE_ADMIN_OBJECT)
  async onNotificationRenewObject(
    job: Job<AdminApproveObjectJobDataType>,
    done: DoneCallback,
  ): Promise<void> {
    const { renterId, landlordObjectId } = job.data;
    try {
      await this.objectMatchesForLandlordService.changeLandlordStatusOfObject({
        renterId: renterId,
        landlordObjectId: landlordObjectId,
        landlordStatus: MatchStatusEnumType.resolved,
      });
      this.logger.info(`Contacts of object ${landlordObjectId} was sent to renter ${renterId}`);
      done();
    } catch (e: any) {
      done(e);
      this.logger.warn(
        `Sending contacts of object ${landlordObjectId} to renter ${renterId} is delayed for 30 minutes`,
      );
    }
  }
}
