import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { ConfigService } from '@nestjs/config';
import { MyContext } from '../../main/interfaces/bot.interface';
import { PaymentsPricesConfigType } from '../../../configuration/interfaces/configuration.types';
import {
  EMOJI_COMMENT,
  EMOJI_HOLMS_WOMAN,
  EMOJI_INFO,
  EMOJI_KEY,
  EMOJI_NEXT,
  EMOJI_SEND_REQUEST,
  EMOJI_STOP,
  EMOJI_WRITE_TO_CONTACT,
} from '../../constants/emoji';
import { PaymentItems } from '../../../api/payments/interfaces/payment-item.interface';

@Injectable()
export class RentersObjectsKeyboardsService {
  public payContactsMenu: Menu<MyContext>;

  constructor(private readonly configService: ConfigService) {}

  getNoInfoKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard()
      .text(`${EMOJI_COMMENT} Заполнить`, `info_fill_object_${objectId}`)
      .row()
      .text(`${EMOJI_KEY} Получить контакт`, `after_contact_${objectId}`);
  }

  getSendRequestKeyboard(objectId: string, withNext: boolean): InlineKeyboard {
    const keyboard = new InlineKeyboard().text(`${EMOJI_KEY} Получить контакт`, `after_contact_${objectId}`);
    if (withNext) {
      return keyboard.row().text(`${EMOJI_NEXT} Далее`, `after_nextObj_${objectId}`);
    }
    return keyboard;
  }

  getObjectsKeyboard(objectId: string, withNext: boolean): InlineKeyboard {
    const keyboard = new InlineKeyboard()
      .text(`${EMOJI_SEND_REQUEST} Отправить запрос`, `request_${objectId}`)
      .row()
      .text(`${EMOJI_KEY} Получить контакт`, `contact_${objectId}`)
      .row()
      .text(`${EMOJI_STOP} Стоп`, `renter_object_stop`);
    if (withNext) {
      return keyboard.text(`${EMOJI_NEXT} Далее`, `nextObj_${objectId}`);
    }
    return keyboard;
  }

  getContactsKeyboard(objectId: string, withNext: boolean, username?: string): InlineKeyboard {
    let keyboard = new InlineKeyboard();
    if (username) {
      keyboard = keyboard.url(`${EMOJI_WRITE_TO_CONTACT} связаться`, `https://t.me/${username}`).row();
    }
    if (withNext) {
      keyboard = keyboard.text(`${EMOJI_NEXT} Далее`, `contacts_nextObj_${objectId}`);
    }
    return keyboard;
  }

  initPayContactsMenu(privateHelperText: string): void {
    const prices = this.configService.get('payments.prices') as PaymentsPricesConfigType;
    const apiPrefix = this.configService.get('apiPrefix') as string;
    this.payContactsMenu = new Menu<MyContext>('menu-payContacts').dynamic((ctx, range) => {
      const chatId = ctx.from?.id?.toString() as string;
      const oneContactUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['1-contacts']}`;
      const fiveContactsUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['5-contacts']}`;
      range
        .url(`1 контакт - ${prices.oneContacts} ₽`, oneContactUrl)
        .row()
        .url(`5 контактов - ${prices.fiveContacts} ₽`, fiveContactsUrl)
        .row()
        .submenu(`${EMOJI_INFO} Личный помошник`, 'menu-payContacts-sub', async ctx => {
          await ctx.editMessageText(privateHelperText, {
            disable_web_page_preview: true,
          });
        });
    });

    const subMenu = new Menu<MyContext>('menu-payContacts-sub').dynamic((ctx, range) => {
      const chatId = ctx.from?.id?.toString() as string;
      const oneContactUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['1-contacts']}`;
      const fiveContactsUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['5-contacts']}`;
      const privateHelperUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['private-helper']}`;
      range
        .url(`1 контакт - ${prices.oneContacts} ₽`, oneContactUrl)
        .row()
        .url(`5 контактов - ${prices.fiveContacts} ₽`, fiveContactsUrl)
        .row()
        .url(`${EMOJI_HOLMS_WOMAN} Помощник - ${prices.privateHelper} ₽`, privateHelperUrl);
    });
    this.payContactsMenu.register(subMenu);
  }
}
