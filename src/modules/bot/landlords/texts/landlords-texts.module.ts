import { Module } from '@nestjs/common';
import { LandlordsTextsService } from './landlords-texts.service';

@Module({
  imports: [],
  providers: [LandlordsTextsService],
  exports: [LandlordsTextsService],
})
export class LandlordsTextsModule {}
