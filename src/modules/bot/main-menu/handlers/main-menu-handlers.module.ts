import { Module } from '@nestjs/common';
import { MainMenuModule } from '../main-menu.module';
import { MainMenuKeyboardsModule } from '../keyboards/main-menu-keyboards.module';
import { RenterObjectsModule } from '../../renter-objects/renter-objects.module';
import { RentersModule } from '../../renters/renters.module';
import { RentersKeyboardsModule } from '../../renters/keyboards/renters-keyboards.module';
import { RentersHandlersModule } from '../../renters/handlers/renters-handlers.module';
import { MainMenuTextsModule } from '../texts/main-menu-texts.module';
import { LandlordsModule } from '../../landlords/landlords.module';
import { LandlordsKeyboardsModule } from '../../landlords/keyboards/landlords-keyboards.module';
import { LandlordsHandlersModule } from '../../landlords/handlers/landlords-handlers.module';
import { BotKeyboardsModule } from '../../main/keyboards/bot-keyboards.module';
import { BotHandlersModule } from '../../main/handlers/bot-handlers.module';
import { RentersObjectsHandlersModule } from '../../renter-objects/handlers/renters-objects-handlers.module';
import { MainMenuHandlersService } from './main-menu-handlers.service';

@Module({
  imports: [
    MainMenuModule,
    MainMenuKeyboardsModule,
    MainMenuTextsModule,

    RenterObjectsModule,
    RentersModule,
    RentersKeyboardsModule,
    RentersHandlersModule,

    LandlordsModule,
    LandlordsKeyboardsModule,
    LandlordsHandlersModule,

    RentersObjectsHandlersModule,

    BotKeyboardsModule,
    BotHandlersModule,
  ],
  providers: [MainMenuHandlersService],
  exports: [MainMenuHandlersService],
})
export class MainMenuHandlersModule {}
