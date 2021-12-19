import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { RenterMatchesService } from './renter-matches.service';
import { RenterMatchesController } from './renter-matches.controller';
import { RenterMatchesSerializer } from './renter-matches.serializer';

@Module({
  imports: [LoggerModule, FlowXoModule, AnalyticsModule],
  controllers: [RenterMatchesController],
  providers: [RenterMatchesService, RenterMatchesSerializer],
  exports: [RenterMatchesService],
})
export class RenterMatchesModule {}
