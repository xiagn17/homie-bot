import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger/logger.module';
import { LandlordRenterMatchesModule } from '../../../api/landlord-renter-matches/landlord-renter-matches.module';
import { QueueApproveAdminObjectConsumerService } from './queue-approve-admin-object.consumer.service';

@Module({
  imports: [LoggerModule, LandlordRenterMatchesModule],
  providers: [QueueApproveAdminObjectConsumerService],
})
export class QueueApproveAdminObjectConsumerModule {}
