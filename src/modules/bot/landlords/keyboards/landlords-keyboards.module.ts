import { Module } from '@nestjs/common';
import { LandlordsApiModule } from '../api/landlords-api.module';
import { LandlordsKeyboardsService } from './landlords-keyboards.service';

@Module({
  imports: [LandlordsApiModule],
  providers: [LandlordsKeyboardsService],
  exports: [LandlordsKeyboardsService],
})
export class LandlordsKeyboardsModule {}
