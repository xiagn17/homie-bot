import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import {
  QUEUE_APPROVE_ADMIN_OBJECT_NAME,
  JOB_APPROVE_ADMIN_OBJECT,
} from '../queue-approve-admin-object.constants';
import { AdminApproveObjectJobDataType } from '../queue-approve-admin-object.types';

type JobType = { name: string; data: AdminApproveObjectJobDataType; opts: { jobId: string } };

@Injectable()
export class QueueApproveAdminObjectProducerService {
  private backoffTimeout: number = 30 * 60 * 1000;

  constructor(
    @InjectQueue(QUEUE_APPROVE_ADMIN_OBJECT_NAME)
    private queue: Queue<AdminApproveObjectJobDataType>,
  ) {}

  async setApproveAdminObject(renterId: string, landlordObjectId: string): Promise<void> {
    const jobId = `${renterId}_${landlordObjectId}`;
    await this.removeJob(jobId);
    await this.addJob({
      name: JOB_APPROVE_ADMIN_OBJECT,
      data: { renterId, landlordObjectId },
      opts: { jobId: jobId },
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
    const SIX_HOURS_TIMESTAMP = 6 * 60 * 60 * 1000;
    return {
      delay: SIX_HOURS_TIMESTAMP,
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: this.backoffTimeout,
      },
    };
  }
}
