import { Module } from '@nestjs/common';
import { MainMenuTextsService } from './main-menu-texts.service';

@Module({
  imports: [],
  providers: [MainMenuTextsService],
  exports: [MainMenuTextsService],
})
export class MainMenuTextsModule {}
