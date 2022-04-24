import { Injectable } from '@nestjs/common';
import { SendReviewForm, SendReviewReason, SendReviewStars } from './interfaces/reviews.interface';
import { ReviewsKeyboardsService } from './keyboards/reviews-keyboards.service';
import { ReviewsTextsService } from './texts/reviews-texts.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsKeyboardsService: ReviewsKeyboardsService,
    private readonly reviewsTextsService: ReviewsTextsService,
  ) {}

  sendReviewReason: SendReviewReason = async ctx => {
    const type = (await ctx.session).type;
    await ctx.reply(this.reviewsTextsService.getReasonText(), {
      reply_markup: this.reviewsKeyboardsService.getReasonsKeyboard(type),
    });
  };

  sendReviewStars: SendReviewStars = async ctx => {
    await ctx.reply(this.reviewsTextsService.getStarsText(), {
      reply_markup: this.reviewsKeyboardsService.getStarsKeyboard(),
    });
  };

  sendReviewForm: SendReviewForm = async ctx => {
    await ctx.reply(await this.reviewsTextsService.getFormText(ctx), {
      reply_markup: await this.reviewsKeyboardsService.getFormKeyboard(ctx),
    });
  };
}
