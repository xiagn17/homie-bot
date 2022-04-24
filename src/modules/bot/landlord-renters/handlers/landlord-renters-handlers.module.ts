import { Module } from '@nestjs/common';
import { LandlordRentersApiModule } from '../api/landlord-renters-api.module';
import { LandlordRentersTextsModule } from '../texts/landlord-renters-texts.module';
import { ReviewsModule } from '../../reviews/reviews.module';
import { LandlordRentersHandlersService } from './landlord-renters-handlers.service';

@Module({
  imports: [LandlordRentersApiModule, LandlordRentersTextsModule, ReviewsModule],
  providers: [LandlordRentersHandlersService],
  exports: [LandlordRentersHandlersService],
})
export class LandlordRentersHandlersModule {}
