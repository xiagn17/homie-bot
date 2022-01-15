import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from '../../../logger/logger.module';
import { LANDLORD_NOTIFICATIONS_QUEUE_NAME } from '../queue-landlord-notifications.constants';
import { TasksSchedulerModule } from '../../../tasks/scheduler/tasks.scheduler.module';
import { QueueLandlordNotificationsProducerService } from './queue-landlord-notifications.producer.service';

@Module({
  imports: [
    LoggerModule,
    BullModule.registerQueue({ name: LANDLORD_NOTIFICATIONS_QUEUE_NAME }),
    TasksSchedulerModule,
  ],
  providers: [QueueLandlordNotificationsProducerService],
  exports: [QueueLandlordNotificationsProducerService],
})
export class QueueLandlordNotificationsProducerModule {}
