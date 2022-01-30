import { Injectable, OnModuleInit } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { LoggerService } from '../../../logger/logger.service';
import { MyContext } from '../interfaces/bot.interface';
import { RentersService } from '../../renters/renters.service';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { BotApiService } from '../api/bot-api.service';
import {
  ChooseUserTypeHandlerInterface,
  DefaultHandlerInterface,
  StartHandlerInterface,
} from './interfaces/bot-handlers.interface';
import { MenusService } from './menus/menus.service';

@Injectable()
export class BotHandlersService implements OnModuleInit {
  menus: Menu<MyContext>[] = [];

  constructor(
    private logger: LoggerService,
    private menusService: MenusService,
    private rentersService: RentersService,
    private botApiService: BotApiService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit(): void {
    this.menusService.initChooseUserType(this.afterChooseUserType);
    this.menus.push(this.menusService.chooseUserTypeMenu);
  }

  start: StartHandlerInterface = async ctx => {
    // const deeplink = ctx.match;
    await ctx.reply('👋🏻');
    const session = await ctx.session;
    if (!session.type) {
      setTimeout(async () => {
        await this.chooseUserType(ctx);
      }, 1000);
      return;
    }
    if (session.type === TelegramUserType.renter && !session.gender) {
      setTimeout(async () => {
        await this.afterChooseUserType(TelegramUserType.renter, ctx);
      }, 500);
      return;
    }
  };

  chooseUserType: DefaultHandlerInterface = async ctx => {
    await ctx.reply('Вы хотите Найти или Сдать жилье?', {
      reply_markup: this.menusService.chooseUserTypeMenu,
    });
  };

  private afterChooseUserType: ChooseUserTypeHandlerInterface = async (type, ctx) => {
    const botId = ctx.msg?.from?.id?.toString() as string;
    const chatId = ctx.from?.id?.toString() as string;
    const username = ctx.from?.username as string;
    await this.botApiService.create({ bot_id: botId, channel_id: chatId, username: username });

    const session = await ctx.session;
    session.type = type;

    if (type === TelegramUserType.renter) {
      await this.rentersService.chooseGender(ctx);
    }
  };
}
