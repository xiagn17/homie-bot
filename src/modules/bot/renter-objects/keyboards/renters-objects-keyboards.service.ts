import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { ConfigService } from '@nestjs/config';
import { MyContext } from '../../main/interfaces/bot.interface';
import { PaymentsPricesConfigType } from '../../../configuration/interfaces/configuration.types';
import {
  EMOJI_COMMENT,
  EMOJI_NEXT,
  EMOJI_SEND_REQUEST,
  EMOJI_SHARE,
  EMOJI_STOP,
  EMOJI_WRITE_TO_CONTACT,
} from '../../constants/emoji';
import { PaymentItems } from '../../../api/payments/interfaces/payment-item.interface';
import { getReferralLink } from '../../helpers/referralLink/getReferralLink';
import { HandlerOnFreeContactsMenuButton } from '../interfaces/renter-objects-handlers.interface';
import { SendNextObject } from '../interfaces/renter-objects.interface';
import { TEXT_ZA_MENYA } from '../texts/renter-objects-texts.service';

export const KEYBOARD_RENTER_SEE_OBJECTS_PREFIX = 'kb_renterSeeObjects_';

@Injectable()
export class RentersObjectsKeyboardsService {
  public paySubscriptionMenu: Menu<MyContext>;

  public freeSubscriptionMenu: Menu<MyContext>;

  constructor(private readonly configService: ConfigService) {}

  getNoInfoKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard().text(`${EMOJI_COMMENT} Заполнить`, `info_fill_object_${objectId}`);
  }

  getSendRequestKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard().row().text(`${EMOJI_NEXT} Далее`, `after_nextObj_${objectId}`);
  }

  getObjectsKeyboard(objectId: string, withNext: boolean): InlineKeyboard {
    const keyboard = new InlineKeyboard()
      .text(`${EMOJI_SEND_REQUEST} Связаться`, `request_${objectId}`)
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

  getSeeObjectsKeyboard(): InlineKeyboard {
    return new InlineKeyboard().text(`${EMOJI_NEXT} Смотреть объявления`, KEYBOARD_RENTER_SEE_OBJECTS_PREFIX);
  }

  initPaySubscriptionMenu(
    _onFreeSubscriptionButtonHandler: HandlerOnFreeContactsMenuButton,
    onSendNextObjectHandler: SendNextObject,
  ): void {
    const prices = this.configService.get('payments.prices') as PaymentsPricesConfigType;
    const apiPrefix = this.configService.get('apiPrefix') as string;
    this.paySubscriptionMenu = new Menu<MyContext>('menu-payContacts').dynamic((ctx, range) => {
      const chatId = ctx.from?.id?.toString() as string;
      const subscriptionOneWeekUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['subscription-1-week']}`;
      const subscriptionTwoWeeksUrl = `${apiPrefix}/payments/${chatId}/${PaymentItems['subscription-2-weeks']}`;
      range
        // .text('Получить бесплатно', onFreeSubscriptionButtonHandler)
        .row()
        .url(`${prices.subscriptionOneWeek} ₽ / 1 нед`, subscriptionOneWeekUrl)
        .row()
        .url(`${prices.subscriptionTwoWeeks} ₽ / 2 нед`, subscriptionTwoWeeksUrl)
        .text(`Сделайте все за меня 💫`, ctx => ctx.reply(TEXT_ZA_MENYA));
    });

    this.freeSubscriptionMenu = new Menu<MyContext>('menu-payContacts-sub').dynamic((ctx, range) => {
      const chatId = ctx.from?.id?.toString() as string;
      const referralLink = getReferralLink(chatId);
      range
        .url(`${EMOJI_SHARE} Поделиться Homie`, `https://t.me/share/url?url=${referralLink}`)
        .row()
        .text(`${EMOJI_NEXT} Смотреть объявления`, onSendNextObjectHandler);
    });
    this.paySubscriptionMenu.register(this.freeSubscriptionMenu);
  }
}
