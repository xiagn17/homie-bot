import { Module } from '@nestjs/common';
import { LandlordObjectsModule } from '../../../api/landlord-objects/landlord-objects.module';
import { LandlordsApiService } from './landlords-api.service';

@Module({
  imports: [LandlordObjectsModule],
  providers: [LandlordsApiService],
  exports: [LandlordsApiService],
})
export class LandlordsApiModule {}
