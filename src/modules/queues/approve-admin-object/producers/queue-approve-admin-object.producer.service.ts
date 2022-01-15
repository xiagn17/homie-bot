import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_APPROVE_ADMIN_OBJECT_NAME } from '../queue-approve-admin-object.constants';
import { AdminApproveObjectJobDataType } from '../queue-approve-admin-object.types';
import { TasksSchedulerService } from '../../../tasks/scheduler/tasks.scheduler.service';
const HALF_HOUR_TIMESTAMP = 30 * 60 * 1000;

@Injectable()
export class QueueApproveAdminObjectProducerService implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_APPROVE_ADMIN_OBJECT_NAME)
    private queue: Queue<AdminApproveObjectJobDataType>,

    private tasksSchedulerService: TasksSchedulerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const jobs = await this.queue.getJobs(['waiting', 'active', 'delayed']);
    console.log(jobs.length, ' putting to table approve');
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const scheduledFor = new Date(job.timestamp + HALF_HOUR_TIMESTAMP);
      const { renterId, landlordObjectId } = job.data;
      await this.tasksSchedulerService.setAdminApproveObject({ renterId, landlordObjectId }, scheduledFor);
      await this.queue.removeJobs(job.id as string);
    }
  }
}
