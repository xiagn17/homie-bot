import { Module } from '@nestjs/common';
import { MainMenuApiModule } from '../api/main-menu-api.module';
import { BotKeyboardsModule } from '../../main/keyboards/bot-keyboards.module';
import { RentersKeyboardsModule } from '../../renters/keyboards/renters-keyboards.module';
import { LandlordsKeyboardsModule } from '../../landlords/keyboards/landlords-keyboards.module';
import { MainMenuKeyboardsService } from './main-menu-keyboards.service';

@Module({
  imports: [MainMenuApiModule, BotKeyboardsModule, RentersKeyboardsModule, LandlordsKeyboardsModule],
  providers: [MainMenuKeyboardsService],
  exports: [MainMenuKeyboardsService],
})
export class MainMenuKeyboardsModule {}
