import { Injectable } from '@nestjs/common';
import { ReviewsService } from '../../../api/reviews/reviews.service';
import { ReviewReasons } from '../../../api/reviews/interfaces/reviews.type';

@Injectable()
export class ReviewsApiService {
  constructor(private readonly reviewsService: ReviewsService) {}

  addReason(chatId: string, reason: ReviewReasons): Promise<void> {
    return this.reviewsService.addReason(chatId, reason);
  }

  addStars(chatId: string, stars: number): Promise<void> {
    return this.reviewsService.addStars(chatId, stars);
  }
}
