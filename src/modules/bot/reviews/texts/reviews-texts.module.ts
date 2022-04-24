import { Module } from '@nestjs/common';
import { ReviewsTextsService } from './reviews-texts.service';

@Module({
  imports: [],
  providers: [ReviewsTextsService],
  exports: [ReviewsTextsService],
})
export class ReviewsTextsModule {}
