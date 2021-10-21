import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { RenterMatchesModule } from '../renter-matches/renter-matches.module';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotController } from './telegram-bot.controller';
import { TelegramBotSerializer } from './telegram-bot.serializer';

@Module({
  imports: [LoggerModule, RenterMatchesModule, AnalyticsModule],
  controllers: [TelegramBotController],
  providers: [TelegramBotService, TelegramBotSerializer],
  exports: [],
})
export class TelegramBotModule {}
