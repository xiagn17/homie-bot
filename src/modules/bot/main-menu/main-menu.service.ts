import { Injectable } from '@nestjs/common';
import { TelegramUserType } from '../session-storage/interfaces/session-storage.interface';
import { GetFirstMenuTip, GetMainMenu, GetMainMenuText } from './interfaces/main-menu.interface';
import { MainMenuTextsService } from './texts/main-menu-texts.service';
import { MainMenuKeyboardsService } from './keyboards/main-menu-keyboards.service';

@Injectable()
export class MainMenuService {
  constructor(
    private readonly mainMenuTextsService: MainMenuTextsService,
    private readonly mainMenuKeyboardsService: MainMenuKeyboardsService,
  ) {}

  getFirstMenuTip: GetFirstMenuTip = async ctx => {
    await ctx.reply(this.mainMenuTextsService.getFirstMenuTip());
    const session = await ctx.session;
    session.renter.firstMenuTip = true;
    setTimeout(() => void this.getMenu(ctx), 3500);
  };

  getMenu: GetMainMenu = async ctx => {
    const session = await ctx.session;
    if (session.type === TelegramUserType.renter) {
      const text = this.mainMenuTextsService.getRenterMainPageText();
      await ctx.reply(text, {
        reply_markup: this.mainMenuKeyboardsService.renterMainMenu,
      });
      return;
    } else if (session.type === TelegramUserType.landlord) {
      return;
    }
  };

  getMenuText: GetMainMenuText = async ctx => {
    const session = await ctx.session;
    if (session.type === TelegramUserType.renter) {
      return this.mainMenuTextsService.getRenterMainPageText();
    }

    return '';
  };
}
