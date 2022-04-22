import { Injectable } from '@nestjs/common';
import { EMOJI_CELEBRATE } from '../constants/emoji';
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
  GetContact,
  SendNextObject,
  SendObject,
  SendObjectContact,
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
    const renter = await this.renterObjectsApiService.getRenterEntityOfUser(chatId);
    const ableContacts = renter.settings.ableContacts;
    const text = this.renterObjectsTextsService.getObjectText(object, ableContacts);
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

  getPaidContact: GetContact = async (objectId, ctx) => {
    const chatId = ctx.from?.id?.toString() as string;
    const renter = await this.renterObjectsApiService.getRenterEntityOfUser(chatId);
    if (renter.settings.ableContacts === 0) {
      const text = this.renterObjectsTextsService.getNoContactsPayWindowText();
      const keyboard = this.renterObjectsKeyboardsService.payContactsMenu;
      await ctx.reply(text, { reply_markup: keyboard, disable_web_page_preview: true });
      return false;
    } else {
      const object = await this.renterObjectsApiService.getLandlordContact({ renterId: renter.id, objectId });
      await this.sendObjectContact(object, ctx);

      return true;
    }
  };

  sendObjectContact: SendObjectContact = async (object, ctx) => {
    const contactsText = this.renterObjectsTextsService.getContactObjectText(object);
    await ctx.reply(`${EMOJI_CELEBRATE}`);

    const tgUsername =
      !object.isAdmin && object.telegramUser.username ? object.telegramUser.username : undefined;
    await ctx.reply(contactsText, {
      reply_markup: this.renterObjectsKeyboardsService.getContactsKeyboard(object.id, true, tgUsername),
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
    await this.renterObjectsApiService.markObjectAsInterested({ objectId: objectId, chatId: chatId });
    const object = await this.renterObjectsApiService.getObject(objectId);
    const isAdminObject = object.isAdmin;
    const objectNumber = object.number;

    const text = isAdminObject
      ? this.renterObjectsTextsService.getSendRequestAdminObjectText(objectNumber)
      : this.renterObjectsTextsService.getSendRequestText(objectNumber);
    const keyboard = this.renterObjectsKeyboardsService.getSendRequestKeyboard(objectId, true);
    await ctx.reply(text, {
      reply_markup: keyboard,
    });

    sendAnalyticsEvent(
      chatId,
      RENTER_ACTION,
      isAdminObject ? RENTER_INFO_SEND2_EVENT : RENTER_INFO_SEND_EVENT,
    );
  };
}
