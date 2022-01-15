import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { LANDLORD_NOTIFICATIONS_QUEUE_NAME } from '../queue-landlord-notifications.constants';
import { ToUpdateObjectJobDataType } from '../queue-landlord-notifications.types';
import { TasksSchedulerService } from '../../../tasks/scheduler/tasks.scheduler.service';

const ONE_DAY_TIMESTAMP = 24 * 60 * 60 * 1000;

@Injectable()
export class QueueLandlordNotificationsProducerService implements OnModuleInit {
  constructor(
    @InjectQueue(LANDLORD_NOTIFICATIONS_QUEUE_NAME)
    private queue: Queue<ToUpdateObjectJobDataType>,

    private tasksSchedulerService: TasksSchedulerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const jobs = await this.queue.getJobs(['waiting', 'active', 'delayed', 'paused']);
    console.log(jobs.length, ' putting to table landlord');

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const scheduledFor = new Date(job.timestamp + ONE_DAY_TIMESTAMP);
      const landlordObjectId = job.data;
      await this.tasksSchedulerService.setTaskLandlordRenewNotification({ landlordObjectId }, scheduledFor);
      await this.queue.removeJobs(job.id as string);
    }
  }
}
