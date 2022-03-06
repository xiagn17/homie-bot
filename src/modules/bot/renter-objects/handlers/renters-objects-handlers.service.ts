import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer } from 'grammy';
import { InlineKeyboardButton } from '@grammyjs/types';
import { MyContext } from '../../main/interfaces/bot.interface';
import { RenterObjectsService } from '../renter-objects.service';
import {
  HandlerGetContact,
  HandlerGetNextObject,
  HandlerSendRequest,
} from '../interfaces/renter-objects-handlers.interface';
import { RenterObjectsApiService } from '../api/renter-objects-api.service';
import { RentersObjectsKeyboardsService } from '../keyboards/renters-objects-keyboards.service';
import UrlButton = InlineKeyboardButton.UrlButton;

@Injectable()
export class RentersObjectsHandlersService implements OnModuleInit {
  composer: Composer<MyContext> = new Composer<MyContext>();

  constructor(
    private readonly renterObjectsService: RenterObjectsService,
    private readonly renterObjectsApiService: RenterObjectsApiService,
    private readonly renterObjectsKeyboardsService: RentersObjectsKeyboardsService,
  ) {}

  onModuleInit(): void {
    this.composer.callbackQuery(/^request_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const objectId = data.split('request_')[1];
      await this.onSendRequestHandler(objectId, ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(/^contact_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const objectId = data.split('contact_')[1];
      await this.onGetContactHandler(objectId, ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(/^nextObj_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const objectId = data.split('nextObj_')[1];
      await this.onGetNextObjectHandler(objectId, ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(/^after_contact_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const objectId = data.split('after_contact_')[1];
      await this.onGetContactAfterHandler(objectId, ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(/^after_nextObj_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const objectId = data.split('after_nextObj_')[1];
      await this.onGetNextObjectAfterHandler(objectId, ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(/^contacts_nextObj_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const objectId = data.split('contacts_nextObj_')[1];
      await this.onGetNextObjectPaidContactsHandler(objectId, ctx);
      await ctx.answerCallbackQuery();
    });
  }

  private onSendRequestHandler: HandlerSendRequest = async (objectId, ctx) => {
    const infoExists = await this.renterObjectsApiService.isInfoExists(ctx.from?.id.toString() as string);
    if (!infoExists) {
      await this.renterObjectsService.sendRenterInfoNotExists(objectId, ctx);
      return;
    }

    await this.renterObjectsService.sendObjectRequest(objectId, ctx);

    const keyboardToObjectMessage = ctx.msg?.reply_markup?.inline_keyboard.filter(k =>
      k[0].text.includes('Получить контакт'),
    ) as InlineKeyboardButton[][];
    await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: keyboardToObjectMessage } });
  };

  private onGetContactHandler: HandlerGetContact = async (objectId, ctx) => {
    const isContactSent = await this.renterObjectsService.getPaidContact(objectId, ctx);
    if (isContactSent) {
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    }
  };

  private onGetContactAfterHandler: HandlerGetContact = async (objectId, ctx) => {
    const isContactSent = await this.renterObjectsService.getPaidContact(objectId, ctx);
    if (isContactSent) {
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    }
  };

  private onGetNextObjectHandler: HandlerGetNextObject = async (objectId, ctx) => {
    await ctx.editMessageReplyMarkup({
      reply_markup: this.renterObjectsKeyboardsService.getObjectsKeyboard(objectId, false),
    });

    await this.renterObjectsService.sendNextObject(ctx);
  };

  private onGetNextObjectAfterHandler: HandlerGetNextObject = async (objectId, ctx) => {
    await ctx.editMessageReplyMarkup({
      reply_markup: this.renterObjectsKeyboardsService.getSendRequestKeyboard(objectId, false),
    });
    await this.renterObjectsService.sendNextObject(ctx);
  };

  private onGetNextObjectPaidContactsHandler: HandlerGetNextObject = async (objectId, ctx) => {
    const usernameUrl = (ctx.msg?.reply_markup?.inline_keyboard[0][0] as UrlButton)?.url;
    const username = usernameUrl ? usernameUrl.split('https://t.me/')[1] : undefined;
    await ctx.editMessageReplyMarkup({
      reply_markup: this.renterObjectsKeyboardsService.getContactsKeyboard(objectId, false, username),
    });
    await this.renterObjectsService.sendNextObject(ctx);
  };
}
