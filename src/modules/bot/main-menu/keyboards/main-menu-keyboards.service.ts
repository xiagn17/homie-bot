import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../main/interfaces/bot.interface';
import { MainMenuTextsService } from '../texts/main-menu-texts.service';
import {
  HandlerOnFilters,
  HandlerOnNextObject,
  HandlerOnRenterInfo,
} from '../interfaces/main-menu-handlers.interface';
import {
  EMOJI_BACK,
  EMOJI_FILTER,
  EMOJI_INFO,
  EMOJI_LOOPA,
  EMOJI_NEXT,
  EMOJI_STATUS,
  EMOJI_SUPPORT,
  EMOJI_WOMAN_HAND,
} from '../../constants/emoji';

@Injectable()
export class MainMenuKeyboardsService {
  public renterMainMenu: Menu<MyContext>;

  constructor(private readonly mainMenuTextsService: MainMenuTextsService) {}

  initRenterMainMenu(
    onNextObject: HandlerOnNextObject,
    onSendFilters: HandlerOnFilters,
    filtersKeyboard: Menu<MyContext>,
    renterInfoKeyboard: Menu<MyContext>,
    onSendRenterInfo: HandlerOnRenterInfo,
  ): void {
    this.renterMainMenu = new Menu<MyContext>('keyboard-renterMainMenu')
      .submenu(`${EMOJI_FILTER} Фильтр`, 'keyboard-filters', onSendFilters)
      .text(`${EMOJI_WOMAN_HAND} Анкета`, onSendRenterInfo)
      .row()
      .text(`${EMOJI_NEXT} Смотреть объявления`, onNextObject)
      .row()
      .url(`${EMOJI_SUPPORT} Поддержка`, 'https://t.me/homie_admin')
      .submenu(`${EMOJI_INFO} Прочее`, 'keyboard-renterSecondMenu', async ctx => {
        await ctx.editMessageText(this.mainMenuTextsService.getRenterSecondPageText());
      });

    const secondMenu = new Menu<MyContext>('keyboard-renterSecondMenu')
      .text(`${EMOJI_LOOPA} Поиск по ID`)
      .row()
      .text(`${EMOJI_STATUS} Изменить статус`)
      .row()
      .text(`${EMOJI_INFO} О нас`, async ctx => {
        if (ctx.msg?.text?.includes('Поиск по ID')) {
          const aboutText = this.mainMenuTextsService.getAboutUsText();
          await ctx.editMessageText(aboutText);
        }
      })
      .back(`${EMOJI_BACK} Главное меню`, async ctx => {
        await ctx.editMessageText(this.mainMenuTextsService.getRenterMainPageText());
      });

    this.renterMainMenu.register(secondMenu);
    this.renterMainMenu.register(filtersKeyboard);
    this.renterMainMenu.register(renterInfoKeyboard);
  }
}
