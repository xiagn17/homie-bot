import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { BotHandlersModule } from '../handlers/bot-handlers.module';
import { SessionStorageModule } from '../session-storage/session-storage.module';
import { BotService } from './bot.service';

@Module({
  imports: [LoggerModule, BotHandlersModule, SessionStorageModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
