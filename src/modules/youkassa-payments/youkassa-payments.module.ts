import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { YoukassaPaymentsService } from './youkassa-payments.service';
import { YoukassaPaymentsFabricService } from './youkassa-payments-fabric.service';

@Module({
  imports: [LoggerModule],
  providers: [YoukassaPaymentsService, YoukassaPaymentsFabricService],
  exports: [YoukassaPaymentsService],
})
export class YoukassaPaymentsModule {}
