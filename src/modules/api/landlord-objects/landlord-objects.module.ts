import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { LandlordObjectsController } from './landlord-objects.controller';

@Module({
  imports: [LoggerModule, AnalyticsModule],
  controllers: [LandlordObjectsController],
  providers: [LandlordObjectsService, LandlordObjectsSerializer],
  exports: [LandlordObjectsService, LandlordObjectsSerializer],
})
export class LandlordObjectsModule {}
