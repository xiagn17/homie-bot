import { Module } from '@nestjs/common';
import { QueueApproveAdminObjectConsumerModule } from './approve-admin-object/consumers/queue-approve-admin-object.consumer.module';
import { LandlordNotificationsQueueProducerModule } from './landlord-notifications/consumers/queue-landlord-notifications.consumer.module';

@Module({
  imports: [QueueApproveAdminObjectConsumerModule, LandlordNotificationsQueueProducerModule],
  exports: [QueueApproveAdminObjectConsumerModule, LandlordNotificationsQueueProducerModule],
})
export class QueuesConsumersModule {}
