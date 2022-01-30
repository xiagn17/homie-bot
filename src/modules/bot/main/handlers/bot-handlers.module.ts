import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger/logger.module';
import { RentersModule } from '../../renters/renters.module';
import { BotApiModule } from '../api/bot-api.module';
import { BotHandlersService } from './bot-handlers.service';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [LoggerModule, MenusModule, RentersModule, BotApiModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
