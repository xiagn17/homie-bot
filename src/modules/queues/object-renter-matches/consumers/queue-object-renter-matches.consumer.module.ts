import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger/logger.module';
import { LandlordRenterMatchesModule } from '../../../api/landlord-renter-matches/landlord-renter-matches.module';
import { QueueObjectRenterMatchesConsumerService } from './queue-object-renter-matches.consumer.service';

@Module({
  imports: [LoggerModule, LandlordRenterMatchesModule],
  providers: [QueueObjectRenterMatchesConsumerService],
})
export class QueueObjectRenterMatchesConsumerModule {}
