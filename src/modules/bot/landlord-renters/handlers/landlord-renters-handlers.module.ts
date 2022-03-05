import { Module } from '@nestjs/common';
import { LandlordRentersApiModule } from '../api/landlord-renters-api.module';
import { LandlordRentersTextsModule } from '../texts/landlord-renters-texts.module';
import { LandlordRentersHandlersService } from './landlord-renters-handlers.service';

@Module({
  imports: [LandlordRentersApiModule, LandlordRentersTextsModule],
  providers: [LandlordRentersHandlersService],
  exports: [LandlordRentersHandlersService],
})
export class LandlordRentersHandlersModule {}
