import { Module } from '@nestjs/common';
import { TelegramBotModule } from '../../../api/telegram-bot/telegram-bot.module';
import { BotApiService } from './bot-api.service';

@Module({
  imports: [TelegramBotModule],
  providers: [BotApiService],
  exports: [BotApiService],
})
export class BotApiModule {}
