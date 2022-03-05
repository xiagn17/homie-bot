import { Module } from '@nestjs/common';
import { LandlordRenterMatchesModule } from '../../../api/landlord-renter-matches/landlord-renter-matches.module';
import { LandlordObjectsModule } from '../../../api/landlord-objects/landlord-objects.module';
import { LandlordRentersApiService } from './landlord-renters-api.service';

@Module({
  imports: [LandlordRenterMatchesModule, LandlordObjectsModule],
  providers: [LandlordRentersApiService],
  exports: [LandlordRentersApiService],
})
export class LandlordRentersApiModule {}
