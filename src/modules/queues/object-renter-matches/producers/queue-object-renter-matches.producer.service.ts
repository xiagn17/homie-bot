import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import {
  QUEUE_OBJECT_RENTER_MATCHES_NAME,
  JOB_CREATE_MATCHES_FOR_RENTER,
  JOB_CREATE_MATCHES_FOR_OBJECT,
} from '../queue-object-renter-matches.constants';
import { CreateObjectRenterMatchesJobDataType } from '../queue-object-renter-matches.types';

type JobType = { name: string; data: CreateObjectRenterMatchesJobDataType; opts: { jobId: string } };

@Injectable()
export class QueueObjectRenterMatchesProducerService {
  private backoffTimeout: number = 60 * 1000;

  constructor(
    @InjectQueue(QUEUE_OBJECT_RENTER_MATCHES_NAME)
    private queue: Queue<CreateObjectRenterMatchesJobDataType>,
  ) {}

  public async pushJobCreateMatchesForObject(landlordObjectId: string): Promise<void> {
    const jobId = `landlord_${landlordObjectId}`;
    await this.addJob({
      name: JOB_CREATE_MATCHES_FOR_OBJECT,
      data: { landlordObjectId },
      opts: { jobId: jobId },
    });
  }

  public async pushJobCreateMatchesForRenter(renterId: string): Promise<void> {
    const jobId = `renter_${renterId}`;
    await this.addJob({
      name: JOB_CREATE_MATCHES_FOR_RENTER,
      data: { renterId },
      opts: { jobId: jobId },
    });
  }

  private async addJob(job: JobType): Promise<void> {
    await this.queue.add(job.name, job.data, {
      ...this.getDefaultOptionsForJob(),
      ...job.opts,
    });
  }

  private getDefaultOptionsForJob(): JobOptions {
    return {
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: this.backoffTimeout,
      },
    };
  }
}
