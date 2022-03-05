import { Module } from '@nestjs/common';
import { LandlordsService } from './landlords.service';
import { LandlordsApiModule } from './api/landlords-api.module';
import { LandlordsKeyboardsModule } from './keyboards/landlords-keyboards.module';
import { LandlordsTextsModule } from './texts/landlords-texts.module';

@Module({
  imports: [LandlordsApiModule, LandlordsKeyboardsModule, LandlordsTextsModule],
  providers: [LandlordsService],
  exports: [LandlordsService],
})
export class LandlordsModule {}
