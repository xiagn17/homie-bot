import { Module } from '@nestjs/common';
import { ReviewsModule } from '../reviews.module';
import { ReviewsApiModule } from '../api/reviews-api.module';
import { ReviewsHandlersService } from './reviews-handlers.service';

@Module({
  imports: [ReviewsModule, ReviewsApiModule],
  providers: [ReviewsHandlersService],
  exports: [ReviewsHandlersService],
})
export class ReviewsHandlersModule {}
