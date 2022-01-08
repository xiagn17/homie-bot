import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from '../../../logger/logger.module';
import { QUEUE_OBJECT_RENTER_MATCHES_NAME } from '../queue-object-renter-matches.constants';
import { QueueObjectRenterMatchesProducerService } from './queue-object-renter-matches.producer.service';

@Module({
  imports: [LoggerModule, BullModule.registerQueue({ name: QUEUE_OBJECT_RENTER_MATCHES_NAME })],
  providers: [QueueObjectRenterMatchesProducerService],
  exports: [QueueObjectRenterMatchesProducerService],
})
export class QueueObjectRenterMatchesProducerModule {}
