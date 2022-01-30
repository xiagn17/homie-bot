import { Module } from '@nestjs/common';
import { LandlordsMenusModule } from './menus/landlords-menus.module';
import { LandlordsService } from './landlords.service';

@Module({
  imports: [LandlordsMenusModule],
  providers: [LandlordsService],
  exports: [LandlordsService],
})
export class LandlordsModule {}
