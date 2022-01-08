import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger/logger.module';
import { FlowXoModule } from '../../../flow-xo/flow-xo.module';
import { QueueLandlordNotificationsConsumerService } from './queue-landlord-notifications.consumer.service';

@Module({
  imports: [LoggerModule, FlowXoModule],
  providers: [QueueLandlordNotificationsConsumerService],
})
export class LandlordNotificationsQueueProducerModule {}
