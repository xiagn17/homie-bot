import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './renters.serializer';
import { RentersController } from './renters.controller';

@Module({
  imports: [LoggerModule, AnalyticsModule, forwardRef(() => LandlordRenterMatchesModule)],
  controllers: [RentersController],
  providers: [RentersService, RentersSerializer],
  exports: [RentersService, RentersSerializer],
})
export class RentersModule {}
