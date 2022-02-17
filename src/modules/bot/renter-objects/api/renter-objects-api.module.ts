import { Module } from '@nestjs/common';
import { LandlordRenterMatchesModule } from '../../../api/landlord-renter-matches/landlord-renter-matches.module';
import { LandlordObjectsModule } from '../../../api/landlord-objects/landlord-objects.module';
import { RentersModule } from '../../../api/renters/renters.module';
import { RenterObjectsApiService } from './renter-objects-api.service';

@Module({
  imports: [LandlordRenterMatchesModule, LandlordObjectsModule, RentersModule],
  providers: [RenterObjectsApiService],
  exports: [RenterObjectsApiService],
})
export class RenterObjectsApiModule {}
