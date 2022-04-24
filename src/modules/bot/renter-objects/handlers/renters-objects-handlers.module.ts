import { Module } from '@nestjs/common';
import { RenterObjectsModule } from '../renter-objects.module';
import { RenterObjectsApiModule } from '../api/renter-objects-api.module';
import { RentersObjectsKeyboardsModule } from '../keyboards/renters-objects-keyboards.module';
import { RenterObjectsTextsModule } from '../texts/renter-objects-texts.module';
import { ReviewsModule } from '../../reviews/reviews.module';
import { RentersObjectsHandlersService } from './renters-objects-handlers.service';

@Module({
  imports: [
    RenterObjectsModule,
    RenterObjectsApiModule,
    RentersObjectsKeyboardsModule,
    RenterObjectsTextsModule,

    ReviewsModule,
  ],
  providers: [RentersObjectsHandlersService],
  exports: [RentersObjectsHandlersService],
})
export class RentersObjectsHandlersModule {}
