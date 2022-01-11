import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { QueueApproveAdminObjectProducerModule } from '../../queues/approve-admin-object/producers/queue-approve-admin-object.producer.module';
import { RentersModule } from '../renters/renters.module';
import { LandlordObjectsModule } from '../landlord-objects/landlord-objects.module';
import { ObjectMatchesForLandlordService } from './object-matches.for-landlord.service';
import { ObjectMatchesForRenterService } from './object-matches.for-renter.service';
import { LandlordRenterMatchesController } from './landlord-renter-matches.controller';

@Module({
  imports: [
    LoggerModule,
    FlowXoModule,
    TelegramBotModule,
    QueueApproveAdminObjectProducerModule,

    // todo remove this shit
    forwardRef(() => RentersModule),
    forwardRef(() => LandlordObjectsModule),
  ],
  controllers: [LandlordRenterMatchesController],
  providers: [ObjectMatchesForLandlordService, ObjectMatchesForRenterService],
  exports: [ObjectMatchesForLandlordService, ObjectMatchesForRenterService],
})
export class LandlordRenterMatchesModule {}
