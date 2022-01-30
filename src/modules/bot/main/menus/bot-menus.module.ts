import { Module } from '@nestjs/common';
import { BotHandlersModule } from '../handlers/bot-handlers.module';
import { RentersModule } from '../../renters/renters.module';
import { BotMenusService } from './bot-menus.service';

@Module({
  imports: [BotHandlersModule, RentersModule],
  providers: [BotMenusService],
  exports: [BotMenusService],
})
export class BotMenusModule {}
