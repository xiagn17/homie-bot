import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger/logger.module';
import { BotApiModule } from '../api/bot-api.module';
import { BotKeyboardsModule } from '../keyboards/bot-keyboards.module';
import { MainMenuModule } from '../../main-menu/main-menu.module';
import { BotHandlersService } from './bot-handlers.service';

@Module({
  imports: [LoggerModule, BotKeyboardsModule, BotApiModule, MainMenuModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
