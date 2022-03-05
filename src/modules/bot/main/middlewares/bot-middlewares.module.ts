import { Module } from '@nestjs/common';
import { BotHandlersModule } from '../handlers/bot-handlers.module';
import { RentersHandlersModule } from '../../renters/handlers/renters-handlers.module';
import { MainMenuHandlersModule } from '../../main-menu/handlers/main-menu-handlers.module';
import { RentersObjectsHandlersModule } from '../../renter-objects/handlers/renters-objects-handlers.module';
import { RentersKeyboardsModule } from '../../renters/keyboards/renters-keyboards.module';
import { MainMenuKeyboardsModule } from '../../main-menu/keyboards/main-menu-keyboards.module';
import { RentersObjectsKeyboardsModule } from '../../renter-objects/keyboards/renters-objects-keyboards.module';
import { LandlordsHandlersModule } from '../../landlords/handlers/landlords-handlers.module';
import { AdminHandlersModule } from '../../admin/handlers/admin-handlers.module';
import { LandlordRentersHandlersModule } from '../../landlord-renters/handlers/landlord-renters-handlers.module';
import { BotMiddlewaresService } from './bot-middlewares.service';

@Module({
  imports: [
    BotHandlersModule,

    AdminHandlersModule,

    RentersHandlersModule,
    RentersKeyboardsModule,

    LandlordsHandlersModule,

    MainMenuHandlersModule,
    MainMenuKeyboardsModule,

    RentersObjectsHandlersModule,
    RentersObjectsKeyboardsModule,

    LandlordRentersHandlersModule,
  ],
  providers: [BotMiddlewaresService],
  exports: [BotMiddlewaresService],
})
export class BotMiddlewaresModule {}
