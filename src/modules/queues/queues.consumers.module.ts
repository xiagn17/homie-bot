import { Module } from '@nestjs/common';
import { QueueApproveAdminObjectConsumerModule } from './approve-admin-object/consumers/queue-approve-admin-object.consumer.module';
import { QueueObjectRenterMatchesConsumerModule } from './object-renter-matches/consumers/queue-object-renter-matches.consumer.module';
import { LandlordNotificationsQueueProducerModule } from './landlord-notifications/consumers/queue-landlord-notifications.consumer.module';

@Module({
  imports: [
    QueueApproveAdminObjectConsumerModule,
    QueueObjectRenterMatchesConsumerModule,
    LandlordNotificationsQueueProducerModule,
  ],
  exports: [
    QueueApproveAdminObjectConsumerModule,
    QueueObjectRenterMatchesConsumerModule,
    LandlordNotificationsQueueProducerModule,
  ],
})
export class QueuesConsumersModule {}
