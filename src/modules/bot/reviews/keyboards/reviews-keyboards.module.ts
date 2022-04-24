import { Module } from '@nestjs/common';
import { ReviewsKeyboardsService } from './reviews-keyboards.service';

@Module({
  imports: [],
  providers: [ReviewsKeyboardsService],
  exports: [ReviewsKeyboardsService],
})
export class ReviewsKeyboardsModule {}
