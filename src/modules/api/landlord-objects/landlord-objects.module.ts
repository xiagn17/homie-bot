import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { TasksSchedulerModule } from '../../tasks/scheduler/tasks.scheduler.module';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { LandlordObjectsController } from './landlord-objects.controller';
import { LandlordObjectsControlService } from './landlord-objects.control.service';

@Module({
  imports: [
    LoggerModule,
    FlowXoModule,
    TelegramBotModule,
    TasksSchedulerModule,
    forwardRef(() => LandlordRenterMatchesModule),
  ],
  controllers: [LandlordObjectsController],
  providers: [LandlordObjectsService, LandlordObjectsSerializer, LandlordObjectsControlService],
  exports: [LandlordObjectsService, LandlordObjectsSerializer],
})
export class LandlordObjectsModule {}
