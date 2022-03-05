import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { TasksSchedulerModule } from '../../tasks/scheduler/tasks.scheduler.module';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { LandlordObjectsControlService } from './landlord-objects.control.service';

@Module({
  imports: [
    LoggerModule,
    TelegramBotModule,
    TasksSchedulerModule,
    forwardRef(() => LandlordRenterMatchesModule),
  ],
  controllers: [],
  providers: [LandlordObjectsService, LandlordObjectsSerializer, LandlordObjectsControlService],
  exports: [LandlordObjectsService, LandlordObjectsSerializer, LandlordObjectsControlService],
})
export class LandlordObjectsModule {}
