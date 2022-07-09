import { Injectable } from '@nestjs/common';
import { sendAnalyticsEvent } from '../../../utils/google-analytics/sendAnalyticsEvent';
import {
  RENTER_ACTION,
  RENTER_INFO_ASK_EVENT,
  RENTER_INFO_SEND2_EVENT,
  RENTER_INFO_SEND_EVENT,
  RENTER_OBJECT_VIEW_EVENT,
} from '../../../utils/google-analytics/events';
import { RentersObjectsKeyboardsService } from './keyboards/renters-objects-keyboards.service';
import { RenterObjectsApiService } from './api/renter-objects-api.service';
import { RenterObjectsTextsService } from './texts/renter-objects-texts.service';
import {
  SendNextObject,
  SendObject,
  SendObjectRequest,
  SendRenterInfoNotExists,
} from './interfaces/renter-objects.interface';

@Injectable()
export class RenterObjectsService {
  constructor(
    private renterObjectsKeyboardsService: RentersObjectsKeyboardsService,
    private renterObjectsApiService: RenterObjectsApiService,
    private renterObjectsTextsService: RenterObjectsTextsService,
  ) {}

  sendNextObject: SendNextObject = async ctx => {
    const chatId = ctx.from?.id?.toString() as string;
    const object = await this.renterObjectsApiService.getNextObject(chatId);
    if (!object) {
      await ctx.reply(this.renterObjectsTextsService.getObjectsEnded());
      return;
    }

    const session = await ctx.session;
    session.renter.viewedObjects = session.renter.viewedObjects + 1;

    await this.sendObject(object, ctx);
  };

  sendObject: SendObject = async (object, ctx) => {
    try {
      await ctx.replyWithMediaGroup(
        object.photoIds.map(id => ({
          type: 'photo',
          media: id,
        })),
      );
    } catch (e) {
      console.error(e);
      await ctx.reply('К сожалению, фотографии не были загружены.');
    }

    const chatId = ctx.from?.id?.toString() as string;
    const text = this.renterObjectsTextsService.getObjectText(object);
    const keyboard = this.renterObjectsKeyboardsService.getObjectsKeyboard(object.id, true);
    await ctx.reply(text, {
      reply_markup: keyboard,
      disable_web_page_preview: true,
    });

    sendAnalyticsEvent(chatId, RENTER_ACTION, RENTER_OBJECT_VIEW_EVENT);
    await this.renterObjectsApiService.markObjectAsNotInterested({
      objectId: object.id,
      chatId: chatId,
    });
  };

  sendRenterInfoNotExists: SendRenterInfoNotExists = async (objectId, ctx) => {
    await ctx.reply(this.renterObjectsTextsService.getNoRenterInfoText(), {
      reply_markup: this.renterObjectsKeyboardsService.getNoInfoKeyboard(objectId),
    });
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_INFO_ASK_EVENT);
  };

  sendObjectRequest: SendObjectRequest = async (objectId, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    const renter = await this.renterObjectsApiService.getRenterEntityOfUser(chatId);

    const subscriptionTrialDidntStarted = renter.settings.subscriptionTrialEnds === null;
    const hasSubscription =
      (renter.settings.subscriptionTrialEnds !== null &&
        renter.settings.subscriptionTrialEnds > new Date()) ||
      (renter.settings.subscriptionEnds !== null && renter.settings.subscriptionEnds > new Date());
    const canSend = subscriptionTrialDidntStarted || hasSubscription;

    if (!canSend) {
      const text = this.renterObjectsTextsService.getNoSubscriptionText();
      const keyboard = this.renterObjectsKeyboardsService.paySubscriptionMenu;
      await ctx.reply(text, { reply_markup: keyboard, disable_web_page_preview: true });
      return false;
    }

    await this.renterObjectsApiService.markObjectAsInterested({ objectId: objectId, chatId: chatId });
    const object = await this.renterObjectsApiService.getObject(objectId);
    const isAdminObject = object.isAdmin;
    const objectNumber = object.number;
    if (subscriptionTrialDidntStarted) {
      await this.renterObjectsApiService.startTrialSubscription(renter.id);
      const renterWithTrial = await this.renterObjectsApiService.getRenterEntityOfUser(chatId);

      const text = isAdminObject
        ? this.renterObjectsTextsService.getSendRequestTrialStartedAdminObjectText(
            objectNumber,
            renterWithTrial.settings.subscriptionTrialEnds as Date,
          )
        : this.renterObjectsTextsService.getSendRequestTrialStartedText(
            objectNumber,
            renterWithTrial.settings.subscriptionTrialEnds as Date,
          );
      const keyboard = this.renterObjectsKeyboardsService.getSendRequestKeyboard(objectId);
      await ctx.reply(text, {
        reply_markup: keyboard,
      });
    }

    sendAnalyticsEvent(
      chatId,
      RENTER_ACTION,
      isAdminObject ? RENTER_INFO_SEND2_EVENT : RENTER_INFO_SEND_EVENT,
    );
    if (isAdminObject) {
      return false;
    }
    return true;
  };
}
