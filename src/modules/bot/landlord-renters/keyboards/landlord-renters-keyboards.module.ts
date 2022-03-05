import { Module } from '@nestjs/common';
import { LandlordRentersKeyboardsService } from './landlord-renters-keyboards.service';

@Module({
  imports: [],
  providers: [LandlordRentersKeyboardsService],
  exports: [LandlordRentersKeyboardsService],
})
export class LandlordRentersKeyboardsModule {}
