import { Module } from '@nestjs/common';
import { MainMenuService } from './main-menu.service';
import { MainMenuTextsModule } from './texts/main-menu-texts.module';
import { MainMenuKeyboardsModule } from './keyboards/main-menu-keyboards.module';
import { MainMenuApiModule } from './api/main-menu-api.module';

@Module({
  imports: [MainMenuTextsModule, MainMenuKeyboardsModule, MainMenuApiModule],
  providers: [MainMenuService],
  exports: [MainMenuService],
})
export class MainMenuModule {}
