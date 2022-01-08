import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { QueueObjectRenterMatchesProducerModule } from '../../queues/object-renter-matches/producers/queue-object-renter-matches.producer.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './renters.serializer';
import { RentersController } from './renters.controller';

@Module({
  imports: [LoggerModule, AnalyticsModule, QueueObjectRenterMatchesProducerModule],
  controllers: [RentersController],
  providers: [RentersService, RentersSerializer],
  exports: [RentersService, RentersSerializer],
})
export class RentersModule {}
