import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotSerializer } from './telegram-bot.serializer';

@Module({
  imports: [LoggerModule, AnalyticsModule],
  controllers: [],
  providers: [TelegramBotService, TelegramBotSerializer],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
