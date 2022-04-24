import { Injectable } from '@nestjs/common';
import { Composer } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  KEYBOARD_REVIEW_REASON_PREFIX,
  KEYBOARD_REVIEW_STARS_PREFIX,
} from '../keyboards/reviews-keyboards.service';
import { getDataFromCallbackQuery } from '../../helpers/getDataFromCallbackQuery';
import {
  HandlerReviewReasonKeyboard,
  HandlerReviewStarsKeyboard,
} from '../interfaces/reviews-handlers.interface';
import { ReviewReasons } from '../../../api/reviews/interfaces/reviews.type';
import { ReviewsApiService } from '../api/reviews-api.service';
import { ReviewsService } from '../reviews.service';

@Injectable()
export class ReviewsHandlersService {
  composer: Composer<MyContext> = new Composer<MyContext>();

  constructor(
    private readonly reviewsApiService: ReviewsApiService,
    private readonly reviewsService: ReviewsService,
  ) {
    this.composer.callbackQuery(new RegExp(`^${KEYBOARD_REVIEW_REASON_PREFIX}`), this.onReasonKeyboard);
    this.composer.callbackQuery(new RegExp(`^${KEYBOARD_REVIEW_STARS_PREFIX}`), this.onStarsKeyboard);
  }

  onReasonKeyboard: HandlerReviewReasonKeyboard = async (ctx, _next) => {
    const reason = getDataFromCallbackQuery<ReviewReasons>(
      KEYBOARD_REVIEW_REASON_PREFIX,
      ctx.callbackQuery.data,
    ) as ReviewReasons;

    const chatId = ctx.from.id.toString();
    await this.reviewsApiService.addReason(chatId, reason);

    await this.reviewsService.sendReviewStars(ctx);
  };

  onStarsKeyboard: HandlerReviewStarsKeyboard = async (ctx, _next) => {
    const starsString = getDataFromCallbackQuery<string>(
      KEYBOARD_REVIEW_STARS_PREFIX,
      ctx.callbackQuery.data,
    ) as string;
    const stars = Number(starsString);

    const chatId = ctx.from.id.toString();
    await this.reviewsApiService.addStars(chatId, stars);

    await this.reviewsService.sendReviewForm(ctx);
  };
}
