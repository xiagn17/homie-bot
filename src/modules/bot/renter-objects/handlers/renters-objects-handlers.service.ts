import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer } from 'grammy';
import { InlineKeyboardButton } from '@grammyjs/types';
import { Router } from '@grammyjs/router';
import { MyContext } from '../../main/interfaces/bot.interface';
import { RenterObjectsService } from '../renter-objects.service';
import {
  HandlerGetContact,
  HandlerGetNextObject,
  HandlerOnFindObjectCallback,
  HandlerOnFindObjectMenuButton,
  HandlerRenterStopSearch,
  HandlerSendRequest,
} from '../interfaces/renter-objects-handlers.interface';
import { RenterObjectsApiService } from '../api/renter-objects-api.service';
import {
  KEYBOARD_RENTER_SEE_OBJECTS_PREFIX,
  RentersObjectsKeyboardsService,
} from '../keyboards/renters-objects-keyboards.service';
import { RenterObjectsTextsService } from '../texts/renter-objects-texts.service';
import {
  RenterInfoRouterSteps,
  TelegramUserType,
} from '../../session-storage/interfaces/session-storage.interface';
import { getObjectNumber } from './helpers/objectNumber.helper';
import UrlButton = InlineKeyboardButton.UrlButton;
import { sendAnalyticsEvent } from '../../../../utils/google-analytics/sendAnalyticsEvent';
import {
  RENTER_ACTION,
  RENTER_CONTACT_2_CLICK_EVENT,
  RENTER_CONTACT_CLICK_EVENT,
  RENTER_LIKE_CLICK_EVENT,
  RENTER_NEXT_CLICK_EVENT,
  RENTER_STOP_CLICK_EVENT,
} from '../../../../utils/google-analytics/events';

const ROUTE_FIND_OBJECT_BY_NUMBER: RenterInfoRouterSteps = 'find_object';

@Injectable()
export class RentersObjectsHandlersService implements OnModuleInit {
  public composer: Composer<MyContext> = new Composer<MyContext>();

  public router: Router<MyContext> = new Router<MyContext>(async ctx => {
    const session = await ctx.session;
    const {
      type,
      renter: { router },
    } = session;
    if (type !== TelegramUserType.renter) {
      return undefined;
    }
    return router;
  });

  constructor(
    private readonly renterObjectsService: RenterObjectsService,
    private readonly renterObjectsApiService: RenterObjectsApiService,
    private readonly renterObjectsKeyboardsService: RentersObjectsKeyboardsService,
    private readonly renterObjectsTextsService: RenterObjectsTextsService,
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
    this.composer.callbackQuery(/^renter_object_stop/, async ctx => {
      await this.onRenterStopSearchHandler(ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(
      new RegExp(`^${KEYBOARD_RENTER_SEE_OBJECTS_PREFIX}`),
      this.renterObjectsService.sendNextObject,
    );

    this.router.route(ROUTE_FIND_OBJECT_BY_NUMBER, this.onFindObjectCallback);
    this.composer.use(this.router);
  }

  public onFindObjectMenuButtonHandler: HandlerOnFindObjectMenuButton = async ctx => {
    const session = await ctx.session;
    session.renter.router = 'find_object';

    await ctx.reply(this.renterObjectsTextsService.getIdInterestedObjectText());
  };

  private onFindObjectCallback: HandlerOnFindObjectCallback = async ctx => {
    const objectNumber = getObjectNumber(ctx.message?.text);
    if (!objectNumber) {
      await ctx.reply('Не удалось распознать ID, попробуй ещё раз');
      return;
    }

    const chatId = ctx.from?.id.toString() as string;
    const object = await this.renterObjectsApiService.findObject(chatId, objectNumber);
    if (object) {
      await this.renterObjectsService.sendObject(object, ctx);
    } else {
      await ctx.reply(this.renterObjectsTextsService.getNotFoundObjectText(), {
        reply_markup: this.renterObjectsKeyboardsService.getSeeObjectsKeyboard(),
      });
    }

    const session = await ctx.session;
    session.renter.router = undefined;
  };

  private onSendRequestHandler: HandlerSendRequest = async (objectId, ctx) => {
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_LIKE_CLICK_EVENT);
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
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_CONTACT_CLICK_EVENT);
    const isContactSent = await this.renterObjectsService.getPaidContact(objectId, ctx);
    if (isContactSent) {
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    }
  };

  private onGetContactAfterHandler: HandlerGetContact = async (objectId, ctx) => {
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_CONTACT_2_CLICK_EVENT);
    const isContactSent = await this.renterObjectsService.getPaidContact(objectId, ctx);
    if (isContactSent) {
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    }
  };

  private onGetNextObjectHandler: HandlerGetNextObject = async (objectId, ctx) => {
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_NEXT_CLICK_EVENT);
    await ctx.editMessageReplyMarkup({
      reply_markup: this.renterObjectsKeyboardsService.getObjectsKeyboard(objectId, false),
    });

    await this.renterObjectsService.sendNextObject(ctx);
  };

  private onGetNextObjectAfterHandler: HandlerGetNextObject = async (objectId, ctx) => {
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_NEXT_CLICK_EVENT);
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

  private onRenterStopSearchHandler: HandlerRenterStopSearch = async ctx => {
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_STOP_CLICK_EVENT);
    const chatId = ctx.from?.id.toString() as string;
    await this.renterObjectsApiService.stopSearch(chatId);
    await ctx.reply(this.renterObjectsTextsService.getStoppedRenterSearchText());
  };

  // private onSeeObjects:
  //     await this.renterObjectsService.sendNextObject(ctx);
}
