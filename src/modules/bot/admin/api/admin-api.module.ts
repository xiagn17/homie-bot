import { Module } from '@nestjs/common';
import { LandlordObjectsModule } from '../../../api/landlord-objects/landlord-objects.module';
import { AdminApiService } from './admin-api.service';

@Module({
  imports: [LandlordObjectsModule],
  providers: [AdminApiService],
  exports: [AdminApiService],
})
export class AdminApiModule {}
