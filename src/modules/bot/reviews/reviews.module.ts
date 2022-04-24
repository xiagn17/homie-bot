import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsKeyboardsModule } from './keyboards/reviews-keyboards.module';
import { ReviewsTextsModule } from './texts/reviews-texts.module';

@Module({
  imports: [ReviewsKeyboardsModule, ReviewsTextsModule],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
