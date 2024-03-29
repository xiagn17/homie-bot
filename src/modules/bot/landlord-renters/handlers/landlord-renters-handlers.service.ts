import { Injectable } from '@nestjs/common';
import { Composer } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import { KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX } from '../keyboards/landlord-renters-keyboards.service';
import { HandlerLandlordRenterActions } from '../interfaces/landlord-renters-handlers.interface';
import { getDataFromCallbackQuery } from '../../helpers/getDataFromCallbackQuery';
import { LandlordRentersApiService } from '../api/landlord-renters-api.service';
import { LandlordRentersTextsService } from '../texts/landlord-renters-texts.service';
import { sendAnalyticsEvent } from '../../../../utils/google-analytics/sendAnalyticsEvent';
import {
  LANDLORD_ACTION,
  LANDLORD_ANKETA_DISLIKE_EVENT,
  LANDLORD_ANKETA_LIKE_EVENT,
  LANDLORD_STOP_SEARCH,
} from '../../../../utils/google-analytics/events';
import { ReviewsService } from '../../reviews/reviews.service';

@Injectable()
export class LandlordRentersHandlersService {
  composer: Composer<MyContext> = new Composer<MyContext>();

  constructor(
    private readonly landlordRentersApiService: LandlordRentersApiService,
    private readonly landlordRentersTextsService: LandlordRentersTextsService,

    private readonly reviewsService: ReviewsService,
  ) {
    this.composer.callbackQuery(
      new RegExp(`^${KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX}`),
      this.onLandlordRenterActions,
    );
  }

  onLandlordRenterActions: HandlerLandlordRenterActions = async ctx => {
    const actionWithRenterId = getDataFromCallbackQuery<string>(
      KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX,
      ctx.callbackQuery.data,
    ) as string;
    const action = actionWithRenterId.split('_')[0] as 'submit' | 'decline' | 'stop';
    const renterId = actionWithRenterId.split('_')[1];
    const chatId = ctx.from.id.toString();

    const caption = ctx.msg?.caption as string;
    if (action === 'submit') {
      const text = this.landlordRentersTextsService.getSubmitRenterText(caption);
      await this.landlordRentersApiService.submitRenter(chatId, renterId);
      await ctx.editMessageCaption({ caption: text });
      sendAnalyticsEvent(chatId, LANDLORD_ACTION, LANDLORD_ANKETA_LIKE_EVENT);
    } else if (action === 'decline') {
      const text = this.landlordRentersTextsService.getDeclinedRenterText(caption);
      await this.landlordRentersApiService.declineRenter(chatId, renterId);
      await ctx.editMessageCaption({ caption: text });
      sendAnalyticsEvent(chatId, LANDLORD_ACTION, LANDLORD_ANKETA_DISLIKE_EVENT);
    } else if (action === 'stop') {
      const text = caption + '\n';
      await this.landlordRentersApiService.stopSearchObject(chatId);
      await ctx.editMessageCaption({ caption: text });

      const stopObjectText = this.landlordRentersTextsService.getStopObjectText();
      await ctx.reply(stopObjectText);

      sendAnalyticsEvent(chatId, LANDLORD_ACTION, LANDLORD_STOP_SEARCH);

      setTimeout(() => {
        this.reviewsService.sendReviewReason(ctx);
      }, 600);
    }
  };
}
