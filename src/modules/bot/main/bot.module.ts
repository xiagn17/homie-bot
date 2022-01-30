import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { SessionStorageModule } from '../session-storage/session-storage.module';
import { BotHandlersModule } from './handlers/bot-handlers.module';
import { BotService } from './bot.service';
import { BotMenusModule } from './menus/bot-menus.module';

@Module({
  imports: [LoggerModule, BotHandlersModule, SessionStorageModule, BotMenusModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
