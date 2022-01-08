import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import {
  LANDLORD_NOTIFICATIONS_QUEUE_NAME,
  NOTIFICATION_RENEW_OBJECT,
} from '../queue-landlord-notifications.constants';
import { ToUpdateObjectJobDataType } from '../queue-landlord-notifications.types';

type JobType = { name: string; data: ToUpdateObjectJobDataType; opts: { jobId: string } };

@Injectable()
export class QueueLandlordNotificationsProducerService {
  private backoffTimeout: number = 30 * 60 * 1000;

  constructor(
    @InjectQueue(LANDLORD_NOTIFICATIONS_QUEUE_NAME)
    private queue: Queue<ToUpdateObjectJobDataType>,
  ) {}

  async sendNotificationRenewObject(landlordObjectId: string): Promise<void> {
    await this.removeJob(landlordObjectId);
    await this.addJob({
      name: NOTIFICATION_RENEW_OBJECT,
      data: landlordObjectId,
      opts: { jobId: landlordObjectId },
    });
  }

  private async addJob(job: JobType): Promise<void> {
    await this.queue.add(job.name, job.data, {
      ...this.getDefaultOptionsForJob(),
      ...job.opts,
    });
  }

  private async removeJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    return job?.remove();
  }

  private getDefaultOptionsForJob(): JobOptions {
    const ONE_DAY_TIMESTAMP = 24 * 60 * 60 * 1000;
    return {
      delay: ONE_DAY_TIMESTAMP,
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: this.backoffTimeout,
      },
    };
  }
}
