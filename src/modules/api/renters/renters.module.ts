import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './renters.serializer';
import { RentersController } from './renters.controller';
import { PaymentSucceededListener } from './listeners/payment-succeeded.listener';

@Module({
  imports: [LoggerModule, AnalyticsModule, FlowXoModule, forwardRef(() => LandlordRenterMatchesModule)],
  controllers: [RentersController],
  providers: [RentersService, RentersSerializer, PaymentSucceededListener],
  exports: [RentersService, RentersSerializer],
})
export class RentersModule {}
