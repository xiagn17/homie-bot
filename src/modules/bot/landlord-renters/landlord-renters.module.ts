import { Module } from '@nestjs/common';
import { LandlordRentersService } from './landlord-renters.service';

@Module({
  imports: [],
  providers: [LandlordRentersService],
  exports: [LandlordRentersService],
})
export class LandlordRentersModule {}
