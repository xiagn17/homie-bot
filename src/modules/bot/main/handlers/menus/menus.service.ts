import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../interfaces/bot.interface';
import { ChooseUserTypeHandlerInterface } from '../interfaces/bot-handlers.interface';
import { TelegramUserType } from '../../../session-storage/interfaces/session-storage.interface';
import { EMOJI_HOUSE, EMOJI_WOMAN_HAND_UP } from '../constants/emoji';

@Injectable()
export class MenusService {
  public chooseUserTypeMenu: Menu<MyContext>;

  initChooseUserType(handler: ChooseUserTypeHandlerInterface): void {
    this.chooseUserTypeMenu = new Menu<MyContext>('menu-chooseUserType')
      .text(`${EMOJI_HOUSE} Снять жилье`, async ctx => {
        ctx.menu.close();
        await handler(TelegramUserType.renter, ctx);
      })
      .text(`${EMOJI_WOMAN_HAND_UP} Сдать жилье`, async ctx => {
        ctx.menu.close();
        await handler(TelegramUserType.landlord, ctx);
      })
      .row();
  }
}
