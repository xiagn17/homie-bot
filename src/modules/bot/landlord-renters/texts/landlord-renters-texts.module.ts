import { Module } from '@nestjs/common';
import { LandlordRentersTextsService } from './landlord-renters-texts.service';

@Module({
  imports: [],
  providers: [LandlordRentersTextsService],
  exports: [LandlordRentersTextsService],
})
export class LandlordRentersTextsModule {}
