import { Module } from '@nestjs/common';
import { ReviewsModule } from '../../../api/reviews/reviews.module';
import { ReviewsApiService } from './reviews-api.service';

@Module({
  imports: [ReviewsModule],
  providers: [ReviewsApiService],
  exports: [ReviewsApiService],
})
export class ReviewsApiModule {}
