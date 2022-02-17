import { Module } from '@nestjs/common';
import { BotHandlersModule } from '../handlers/bot-handlers.module';
import { RentersHandlersModule } from '../../renters/handlers/renters-handlers.module';
import { MainMenuHandlersModule } from '../../main-menu/handlers/main-menu-handlers.module';
import { RentersObjectsHandlersModule } from '../../renter-objects/handlers/renters-objects-handlers.module';
import { BotKeyboardsModule } from '../keyboards/bot-keyboards.module';
import { RentersKeyboardsModule } from '../../renters/keyboards/renters-keyboards.module';
import { MainMenuKeyboardsModule } from '../../main-menu/keyboards/main-menu-keyboards.module';
import { RentersObjectsKeyboardsModule } from '../../renter-objects/keyboards/renters-objects-keyboards.module';
import { BotMiddlewaresService } from './bot-middlewares.service';

@Module({
  imports: [
    BotHandlersModule,
    BotKeyboardsModule,

    RentersHandlersModule,
    RentersKeyboardsModule,

    MainMenuHandlersModule,
    MainMenuKeyboardsModule,

    RentersObjectsHandlersModule,
    RentersObjectsKeyboardsModule,
  ],
  providers: [BotMiddlewaresService],
  exports: [BotMiddlewaresService],
})
export class BotMiddlewaresModule {}
