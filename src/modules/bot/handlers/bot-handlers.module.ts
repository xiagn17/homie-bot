import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { BotHandlersService } from './bot-handlers.service';

@Module({
  imports: [LoggerModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
