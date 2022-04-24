import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
