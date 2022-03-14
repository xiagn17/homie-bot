import { Injectable, OnModuleInit } from '@nestjs/common';
import { Router } from '@grammyjs/router';
import { Composer } from 'grammy';
import { LoggerService } from '../../../logger/logger.service';
import { MyContext } from '../interfaces/bot.interface';
import { BotApiService } from '../api/bot-api.service';
import {
  ChooseUserType,
  HandlerOnUserType,
  HandlerOnUserTypeRoute,
  HandlerStartCommand,
} from '../interfaces/bot-handlers.interface';
import { BotKeyboardsService, KEYBOARD_USER_TYPE_PREFIX } from '../keyboards/bot-keyboards.service';
import { getDataFromCallbackQuery } from '../../helpers/getDataFromCallbackQuery';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { MainMenuService } from '../../main-menu/main-menu.service';
import { clearTemporaryPropertiesInSession } from '../../session-storage/helpers/clear-temp-properties.helper';

const ROUTE_USER_TYPE = 'route-userType';
@Injectable()
export class BotHandlersService implements OnModuleInit {
  public composer: Composer<MyContext> = new Composer<MyContext>();

  public routerUserType: Router<MyContext> = new Router<MyContext>(async ctx => {
    const userType = (await ctx.session).type;
    return !userType ? ROUTE_USER_TYPE : undefined;
  });

  constructor(
    private logger: LoggerService,

    private readonly botKeyboardsService: BotKeyboardsService,
    private readonly botApiService: BotApiService,

    private readonly mainMenuService: MainMenuService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit(): void {
    this.composer.command('start', this.onStartCommandHandler);
    this.routerUserType.route(ROUTE_USER_TYPE, this.onUserTypeRouteHandler);
  }

  public onUserTypeHandler: HandlerOnUserType = async (type, ctx, _next) => {
    const session = await ctx.session;
    if (session.type === type) {
      return;
    }

    const text =
      '💢 Уверен, что хочешь поменять свой статус?\n' + 'После этого действия все мои настройки изменятся.';
    await ctx.editMessageText(text, {
      reply_markup: this.botKeyboardsService.userTypeSubKeyboard,
    });
  };

  public onFinalUserTypeHandler: HandlerOnUserType = async (type, ctx, next) => {
    ctx.menu.close();
    await this.chooseUserType(type, ctx, next);
    await this.mainMenuService.getMenu(ctx);
  };

  public chooseUserType: ChooseUserType = async (type, ctx, next) => {
    const session = await ctx.session;
    session.type = type;
    clearTemporaryPropertiesInSession(session);

    await next();
  };

  private onStartCommandHandler: HandlerStartCommand = async (ctx, next) => {
    const chatId = ctx.from?.id?.toString() as string;
    const username = ctx.from?.username as string;
    const deepLink = ctx.match as string;
    await this.botApiService.create({
      channel_id: chatId,
      username: username,
      deepLink: deepLink.length ? deepLink : null,
    });

    await ctx.reply('👋🏻');
    await new Promise(res => setTimeout(res, 1000));
    await next();
  };

  private onUserTypeRouteHandler: HandlerOnUserTypeRoute = async (ctx, next) => {
    const keyboardData = getDataFromCallbackQuery<TelegramUserType>(
      KEYBOARD_USER_TYPE_PREFIX,
      ctx.callbackQuery?.data,
    );
    if (!keyboardData) {
      await ctx.reply('Вы хотите Найти или Сдать жилье?', {
        reply_markup: this.botKeyboardsService.getInlineUserTypeKeyboard(),
      });
      return;
    }

    await ctx.editMessageReplyMarkup({
      reply_markup: undefined,
    });
    await this.chooseUserType(keyboardData, ctx, next);
  };
}
