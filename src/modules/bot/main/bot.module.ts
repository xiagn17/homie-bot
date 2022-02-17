import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { SessionStorageModule } from '../session-storage/session-storage.module';
import { RedisConnectorModule } from '../../redis-connector/redis-connector.module';
import { BotService } from './bot.service';
import { BotMiddlewaresModule } from './middlewares/bot-middlewares.module';

@Module({
  imports: [LoggerModule, SessionStorageModule, BotMiddlewaresModule, RedisConnectorModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
