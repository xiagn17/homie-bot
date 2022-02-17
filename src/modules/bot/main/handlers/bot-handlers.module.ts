import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger/logger.module';
import { BotApiModule } from '../api/bot-api.module';
import { BotKeyboardsModule } from '../keyboards/bot-keyboards.module';
import { BotHandlersService } from './bot-handlers.service';

@Module({
  imports: [LoggerModule, BotKeyboardsModule, BotApiModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
