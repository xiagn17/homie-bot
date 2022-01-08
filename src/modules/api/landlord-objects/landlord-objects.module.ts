import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { QueueLandlordNotificationsProducerModule } from '../../queues/landlord-notifications/producers/queue-landlord-notifications.producer.module';
import { QueueObjectRenterMatchesProducerModule } from '../../queues/object-renter-matches/producers/queue-object-renter-matches.producer.module';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { LandlordObjectsController } from './landlord-objects.controller';
import { LandlordObjectsControlService } from './landlord-objects.control.service';

@Module({
  imports: [
    LoggerModule,
    FlowXoModule,
    TelegramBotModule,
    QueueObjectRenterMatchesProducerModule,
    QueueLandlordNotificationsProducerModule,
  ],
  controllers: [LandlordObjectsController],
  providers: [LandlordObjectsService, LandlordObjectsSerializer, LandlordObjectsControlService],
  exports: [LandlordObjectsService, LandlordObjectsSerializer],
})
export class LandlordObjectsModule {}
