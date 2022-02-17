import { Injectable, OnModuleInit } from '@nestjs/common';
import { Router } from '@grammyjs/router';
import { Composer } from 'grammy';
import { LoggerService } from '../../../logger/logger.service';
import { MyContext } from '../interfaces/bot.interface';
import { BotApiService } from '../api/bot-api.service';
import {
  HandlerOnUserType,
  HandlerOnUserTypeRoute,
  HandlerStartCommand,
} from '../interfaces/bot-handlers.interface';
import { BotKeyboardsService } from '../keyboards/bot-keyboards.service';

const ROUTE_USER_TYPE = 'route-userType';
@Injectable()
export class BotHandlersService implements OnModuleInit {
  public composer: Composer<MyContext> = new Composer<MyContext>();

  public routerUserType: Router<MyContext> = new Router<MyContext>(async ctx => {
    const userType = (await ctx.session).type;
    return !userType ? ROUTE_USER_TYPE : '';
  });

  constructor(
    private logger: LoggerService,
    private botKeyboardsService: BotKeyboardsService,

    private botApiService: BotApiService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit(): void {
    this.botKeyboardsService.initChooseUserType(this.onUserTypeHandler);

    this.composer.command('start', this.onStartCommandHandler);
    this.routerUserType.route(ROUTE_USER_TYPE, this.onUserTypeRouteHandler);
  }

  private onStartCommandHandler: HandlerStartCommand = async (ctx, next) => {
    await ctx.reply('👋🏻');
    await new Promise(res => setTimeout(res, 1000));
    await next();
  };

  private onUserTypeRouteHandler: HandlerOnUserTypeRoute = async ctx => {
    await ctx.reply('Вы хотите Найти или Сдать жилье?', {
      reply_markup: this.botKeyboardsService.chooseUserTypeKeyboard,
    });
  };

  private onUserTypeHandler: HandlerOnUserType = async (type, ctx, next) => {
    ctx.menu.close();

    const chatId = ctx.from?.id?.toString() as string;
    const username = ctx.from?.username as string;
    await this.botApiService.create({ channel_id: chatId, username: username });

    const session = await ctx.session;
    session.type = type;

    await next();
  };
}
