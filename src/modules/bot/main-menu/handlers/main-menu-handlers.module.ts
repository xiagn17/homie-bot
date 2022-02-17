import { Module } from '@nestjs/common';
import { MainMenuModule } from '../main-menu.module';
import { MainMenuKeyboardsModule } from '../keyboards/main-menu-keyboards.module';
import { RenterObjectsModule } from '../../renter-objects/renter-objects.module';
import { RentersModule } from '../../renters/renters.module';
import { RentersKeyboardsModule } from '../../renters/keyboards/renters-keyboards.module';
import { RentersHandlersModule } from '../../renters/handlers/renters-handlers.module';
import { MainMenuHandlersService } from './main-menu-handlers.service';

@Module({
  imports: [
    MainMenuModule,
    MainMenuKeyboardsModule,

    RenterObjectsModule,
    RentersModule,
    RentersKeyboardsModule,
    RentersHandlersModule,
  ],
  providers: [MainMenuHandlersService],
  exports: [MainMenuHandlersService],
})
export class MainMenuHandlersModule {}
