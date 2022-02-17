import { Module } from '@nestjs/common';
import { BotKeyboardsService } from './bot-keyboards.service';

@Module({
  imports: [],
  providers: [BotKeyboardsService],
  exports: [BotKeyboardsService],
})
export class BotKeyboardsModule {}
