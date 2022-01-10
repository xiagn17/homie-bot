import { OnQueueCleaned, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger/logger.service';
import { ObjectMatchesForLandlordService } from '../../../api/landlord-renter-matches/object-matches.for-landlord.service';
import { ObjectMatchesForRenterService } from '../../../api/landlord-renter-matches/object-matches.for-renter.service';
import {
  JOB_CREATE_MATCHES_FOR_OBJECT,
  JOB_CREATE_MATCHES_FOR_RENTER,
  QUEUE_OBJECT_RENTER_MATCHES_NAME,
} from '../queue-object-renter-matches.constants';
import {
  CreateMatchesForObjectJobDataType,
  CreateMatchesForRenterJobDataType,
} from '../queue-object-renter-matches.types';

@Processor(QUEUE_OBJECT_RENTER_MATCHES_NAME)
@Injectable()
export class QueueObjectRenterMatchesConsumerService {
  constructor(
    private logger: LoggerService,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
    private objectMatchesForRenterService: ObjectMatchesForRenterService,
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

  @Process(JOB_CREATE_MATCHES_FOR_OBJECT)
  async onCreateMatchesForObject(
    job: Job<CreateMatchesForObjectJobDataType>,
    done: DoneCallback,
  ): Promise<void> {
    const { landlordObjectId } = job.data;
    try {
      await this.objectMatchesForLandlordService.matchObjectToRenters(landlordObjectId);
      this.logger.info(`Matches for object ${landlordObjectId} is created!`);
      done();
    } catch (e: any) {
      done(e);
      this.logger.warn(`Matches for object ${landlordObjectId} is delayed for 1 minute`);
    }
  }

  @Process(JOB_CREATE_MATCHES_FOR_RENTER)
  async onCreateMatchesForRenter(
    job: Job<CreateMatchesForRenterJobDataType>,
    done: DoneCallback,
  ): Promise<void> {
    const { renterId } = job.data;
    try {
      await this.objectMatchesForRenterService.matchRenterToObjects(renterId);
      this.logger.info(`Matches for renter ${renterId} is created!`);
      done();
    } catch (e: any) {
      done(e);
      this.logger.warn(`Matches for renter ${renterId} is delayed for 1 minute`);
    }
  }
}
