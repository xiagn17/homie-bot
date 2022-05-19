import { Injectable } from '@nestjs/common';
import { Composer } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  AdminKeyboardsService,
  KEYBOARD_ADMIN_MODERATION_DECLINE_PREFIX,
  KEYBOARD_ADMIN_MODERATION_SUBMIT_PREFIX,
  KEYBOARD_ADMIN_OBJECT_STARRED_PREFIX,
} from '../keyboards/admin-keyboards.service';
import {
  HandlerAdminModerationDecline,
  HandlerAdminModerationSubmit,
  HandlerAdminObjectStarred,
} from '../interfaces/admin-handlers.interface';
import { getDataFromCallbackQuery } from '../../helpers/getDataFromCallbackQuery';
import { AdminApiService } from '../api/admin-api.service';

@Injectable()
export class AdminHandlersService {
  composer: Composer<MyContext> = new Composer<MyContext>();

  constructor(
    private readonly adminApiService: AdminApiService,
    private readonly adminKeyboardsService: AdminKeyboardsService,
  ) {
    this.composer.callbackQuery(
      new RegExp(`^${KEYBOARD_ADMIN_MODERATION_SUBMIT_PREFIX}`),
      this.onAdminModerationSubmit,
    );
    this.composer.callbackQuery(
      new RegExp(`^${KEYBOARD_ADMIN_MODERATION_DECLINE_PREFIX}`),
      this.onAdminModerationDecline,
    );
    this.composer.callbackQuery(
      new RegExp(`^${KEYBOARD_ADMIN_OBJECT_STARRED_PREFIX}`),
      this.onAdminObjectStarred,
    );
  }

  onAdminModerationSubmit: HandlerAdminModerationSubmit = async (ctx, _next) => {
    const objectId = getDataFromCallbackQuery<string>(
      KEYBOARD_ADMIN_MODERATION_SUBMIT_PREFIX,
      ctx.callbackQuery.data,
    ) as string;
    await this.adminApiService.approveObject(objectId, true);

    const text = ctx.msg?.text;
    const keyboard = this.adminKeyboardsService.getAdminObjectStarredKeyboard(objectId);
    if (!text) {
      await ctx.editMessageReplyMarkup({
        reply_markup: keyboard,
      });
      await ctx.reply('Подтверждено!');
      return;
    }
    await ctx.editMessageText(text + '\n\n<b>ПОДТВЕРЖДЕНО</b>', {
      reply_markup: keyboard,
    });
  };

  onAdminModerationDecline: HandlerAdminModerationDecline = async (ctx, _next) => {
    const objectId = getDataFromCallbackQuery<string>(
      KEYBOARD_ADMIN_MODERATION_DECLINE_PREFIX,
      ctx.callbackQuery.data,
    ) as string;
    await this.adminApiService.approveObject(objectId, false);

    const text = ctx.msg?.text;
    if (!text) {
      await ctx.editMessageReplyMarkup({
        reply_markup: undefined,
      });
      await ctx.reply('Отказано!');
      return;
    }
    await ctx.editMessageText(text + '\n\n<b>ОТКАЗАНО</b>', {
      reply_markup: undefined,
    });
  };

  onAdminObjectStarred: HandlerAdminObjectStarred = async (ctx, _next) => {
    const objectId = getDataFromCallbackQuery<string>(
      KEYBOARD_ADMIN_OBJECT_STARRED_PREFIX,
      ctx.callbackQuery.data,
    ) as string;
    await this.adminApiService.makeObjectStarred(objectId);

    const text = ctx.msg?.text;
    if (!text) {
      await ctx.editMessageReplyMarkup({
        reply_markup: undefined,
      });
      await ctx.reply('Это супер-объект!');
      return;
    }
    await ctx.editMessageText(text + '\n\n<b>Это супер-объект!</b>', {
      reply_markup: undefined,
    });
  };
}
