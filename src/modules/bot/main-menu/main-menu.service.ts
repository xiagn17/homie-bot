import { Injectable } from '@nestjs/common';
import { TelegramUserType } from '../session-storage/interfaces/session-storage.interface';
import { GetFirstMenuTip, GetMainMenu, GetMainMenuText } from './interfaces/main-menu.interface';
import { MainMenuTextsService } from './texts/main-menu-texts.service';
import { MainMenuKeyboardsService } from './keyboards/main-menu-keyboards.service';
import { MainMenuApiService } from './api/main-menu-api.service';

@Injectable()
export class MainMenuService {
  constructor(
    private readonly mainMenuTextsService: MainMenuTextsService,
    private readonly mainMenuKeyboardsService: MainMenuKeyboardsService,
    private readonly mainMenuApiService: MainMenuApiService,
  ) {}

  getFirstMenuTip: GetFirstMenuTip = async ctx => {
    await ctx.reply(this.mainMenuTextsService.getFirstMenuTip());
    const session = await ctx.session;
    session.renter.firstMenuTip = true;
    setTimeout(() => void this.getMenu(ctx), 3500);
  };

  getMenu: GetMainMenu = async ctx => {
    const text = await this.getMenuMainPageText(ctx);
    await ctx.reply(text, {
      reply_markup: this.mainMenuKeyboardsService.mainMenuKeyboard,
      disable_web_page_preview: true,
    });
  };

  getMenuMainPageText: GetMainMenuText = async ctx => {
    const session = await ctx.session;
    const chatId = ctx.from?.id.toString() as string;
    if (session.type === TelegramUserType.renter) {
      const renter = await this.mainMenuApiService.getRenterEntityOfUser(chatId);
      return this.mainMenuTextsService.getRenterMainPageText(renter.settings);
    } else if (session.type === TelegramUserType.landlord) {
      const chatId = ctx.from?.id.toString() as string;
      const object = await this.mainMenuApiService.getUserObject(chatId);
      const hasObject = !!object;
      return this.mainMenuTextsService.getLandlordMainPageText(hasObject);
    }

    return '';
  };
}
