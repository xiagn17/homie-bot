import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../interfaces/bot.interface';
import { HandlerOnUserType } from '../interfaces/bot-handlers.interface';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { EMOJI_HOUSE, EMOJI_WOMAN_HAND_UP } from '../../constants/emoji';

@Injectable()
export class BotKeyboardsService {
  public chooseUserTypeKeyboard: Menu<MyContext>;

  initChooseUserType(handler: HandlerOnUserType): void {
    this.chooseUserTypeKeyboard = new Menu<MyContext>('keyboard-chooseUserType')
      .text(`${EMOJI_HOUSE} Снять жилье`, async (ctx, next) => {
        await handler(TelegramUserType.renter, ctx, next);
      })
      .text(`${EMOJI_WOMAN_HAND_UP} Сдать жилье`, async (ctx, next) => {
        await handler(TelegramUserType.landlord, ctx, next);
      })
      .row();
  }
}
