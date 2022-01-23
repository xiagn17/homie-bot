import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { YoukassaPaymentsModule } from '../../youkassa-payments/youkassa-payments.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [LoggerModule, YoukassaPaymentsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
