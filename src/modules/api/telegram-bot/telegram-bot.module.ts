import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { RentersModule } from '../renters/renters.module';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotController } from './telegram-bot.controller';
import { TelegramBotSerializer } from './telegram-bot.serializer';

@Module({
  imports: [LoggerModule, RentersModule],
  controllers: [TelegramBotController],
  providers: [TelegramBotService, TelegramBotSerializer],
  exports: [],
})
export class TelegramBotModule {}
