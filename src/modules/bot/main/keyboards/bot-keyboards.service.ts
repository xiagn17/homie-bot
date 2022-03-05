import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { InlineKeyboard } from 'grammy';
import { MyContext } from '../interfaces/bot.interface';
import { HandlerOnUserType } from '../interfaces/bot-handlers.interface';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { EMOJI_BACK, EMOJI_HOUSE, EMOJI_WOMAN_HAND_UP } from '../../constants/emoji';
import { HandlerOnOther } from '../../main-menu/interfaces/main-menu-handlers.interface';

export const KEYBOARD_USER_TYPE_PREFIX = 'kb_userType_';

@Injectable()
export class BotKeyboardsService {
  public userTypeKeyboard: Menu<MyContext>;

  public userTypeSubKeyboard: Menu<MyContext>;

  initUserTypeKeyboard(
    handlerMenuUserType: HandlerOnUserType,
    onFinalUserType: HandlerOnUserType,
    onBackSubMenu: HandlerOnOther,
  ): void {
    this.userTypeKeyboard = new Menu<MyContext>('keyboard-userType')
      .text(`${EMOJI_HOUSE} Снять жилье`, handlerMenuUserType.bind(this, TelegramUserType.renter))
      .text(`${EMOJI_WOMAN_HAND_UP} Сдать жилье`, handlerMenuUserType.bind(this, TelegramUserType.landlord))
      .row()
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .back(`${EMOJI_BACK} Меню`, () => {});

    this.userTypeSubKeyboard = new Menu<MyContext>('keyboard-userTypeSub')
      .back(`${EMOJI_BACK} Меню`, onBackSubMenu)
      .dynamic(async (mainCtx, range) => {
        const userType = (await mainCtx.session).type;
        const text =
          userType === TelegramUserType.renter
            ? `${EMOJI_WOMAN_HAND_UP}️ Сдать жилье`
            : `${EMOJI_HOUSE}️ Снять жилье`;
        const chosedType =
          userType === TelegramUserType.renter ? TelegramUserType.landlord : TelegramUserType.renter;
        if (!userType) {
          return;
        }
        range.text(text, async (ctx, next) => {
          ctx.menu.close();
          await onFinalUserType(chosedType, ctx, next);
        });
      });

    this.userTypeKeyboard.register(this.userTypeSubKeyboard);
  }

  getInlineUserTypeKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
      .text(`${EMOJI_HOUSE} Снять жилье`, `${KEYBOARD_USER_TYPE_PREFIX}${TelegramUserType.renter}`)
      .text(`${EMOJI_WOMAN_HAND_UP} Сдать жилье`, `${KEYBOARD_USER_TYPE_PREFIX}${TelegramUserType.landlord}`);
  }
}
