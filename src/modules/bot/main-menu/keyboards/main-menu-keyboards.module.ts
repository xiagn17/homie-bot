import { Module } from '@nestjs/common';
import { MainMenuTextsModule } from '../texts/main-menu-texts.module';
import { MainMenuKeyboardsService } from './main-menu-keyboards.service';

@Module({
  imports: [MainMenuTextsModule],
  providers: [MainMenuKeyboardsService],
  exports: [MainMenuKeyboardsService],
})
export class MainMenuKeyboardsModule {}
