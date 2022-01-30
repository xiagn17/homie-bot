import { Module } from '@nestjs/common';
import { LandlordsMenusService } from './landlords-menus.service';

@Module({
  imports: [],
  providers: [LandlordsMenusService],
  exports: [LandlordsMenusService],
})
export class LandlordsMenusModule {}
