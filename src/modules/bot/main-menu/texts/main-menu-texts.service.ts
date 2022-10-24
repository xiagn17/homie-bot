import { Injectable } from '@nestjs/common';
import {
  EMOJI_CHECK,
  EMOJI_DOWN,
  EMOJI_FILTER,
  EMOJI_HOUSE,
  EMOJI_ID,
  EMOJI_INFO,
  EMOJI_LOOPA,
  EMOJI_MAP,
  EMOJI_PHONE,
  EMOJI_SHARE,
  EMOJI_STARS,
  EMOJI_STATUS,
  EMOJI_VERY_HEART,
  EMOJI_WOMAN_HAND,
} from '../../constants/emoji';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { ApiRenterSettings } from '../../../api/renters/interfaces/renters.type';
import { RU_LOCALE } from '../../../../utils/locales';

@Injectable()
export class MainMenuTextsService {
  getRenterMainPageText(renterSettings: ApiRenterSettings): string {
    const isTrialDidntStarted = renterSettings.subscriptionTrialEnds === null;
    const isTrial =
      renterSettings.subscriptionTrialEnds !== null && renterSettings.subscriptionTrialEnds > new Date();
    const isSubscriptionValid =
      renterSettings.subscriptionEnds !== null && renterSettings.subscriptionEnds > new Date();

    let textSubscription = 'отсутствует';
    if (isTrialDidntStarted) {
      textSubscription = 'пробный период';
    } else if (isTrial) {
      textSubscription = `пробный период до ${(
        renterSettings.subscriptionTrialEnds as Date
      ).toLocaleDateString(RU_LOCALE)}`;
    } else if (isSubscriptionValid) {
      textSubscription = `активна до ${(renterSettings.subscriptionEnds as Date).toLocaleDateString(
        RU_LOCALE,
      )}`;
    }
    return (
      `<b>• Menu •</b>\n` +
      `\n` +
      `${EMOJI_FILTER}️ <b>Фильтр</b> - позволит показывать только те объявления, которые соответствуют настройкам.\n` +
      `\n` +
      `${EMOJI_WOMAN_HAND}️ <b>Анкета</b> - её я буду отправлять арендодателем заинтересовавшихся объявлений. А сдающие смогут ее видеть и отправлять Вам сами свои объекты!\n` +
      `\n` +
      `${EMOJI_VERY_HEART} <b>Подписка Homie</b>: <a href='https://telegra.ph/Statusy-v-Homie-05-05'>${textSubscription}</a>`
    );
  }

  getRenterSecondPageText(): string {
    return (
      `<b>• Menu •</b>\n` +
      `\n` +
      `${EMOJI_LOOPA} <b>Поиск по ID</b> - позволит найти конкретный объект по тегу #home...\n` +
      `\n` +
      `${EMOJI_STATUS} <b>Изменить статус</b> - поможет тебе изменить статус из арендатора в арендодателя и наоборот.\n` +
      `\n` +
      `${EMOJI_SHARE} <b>Поделиться Homie</b> - делись уникальной ссылкой на Homie и получи безлимитный доступ ко всем объявлениям и функциям!`
    );
  }

  getAboutUsText(userType?: TelegramUserType): string {
    if (userType === TelegramUserType.renter) {
      return (
        `${EMOJI_INFO} <b>Без посредников и риелторов</b> я собираю внутри себя базу комнат и квартир из открытых источников (групп ФБ и ВК, Циан и пр.) и внутренней базы Homie по всей Москве, чтобы затем отсортировать для тебя самые подходящие варианты!\n` +
        `\n` +
        `${EMOJI_PHONE} <b>Контакты:</b>\n` +
        `тг канал - <a href='https://t.me/homie_msk'>@homie_msk</a>\n` +
        `instagram - <a href='https://instagram.com/homie.rf'>instagram.com/homie.rf</a>\n` +
        `сайт: <a href='https://my-homie.ru/?utm_source=tg'>my-homie.ru/?utm_source=tg</a>`
      );
    }
    if (userType === TelegramUserType.landlord) {
      return (
        `${EMOJI_INFO} <b>Возьму на себя роль риелтора</b> и помогу сократить время на поиск и общение с потенциальными съемщиками.\n` +
        `\n` +
        `${EMOJI_PHONE} <b>Контакты:</b>\n` +
        `тг канал - @homie_msk\n` +
        `instagram - instagram.com/homie.rf\n` +
        `сайт: my-homie.ru/?utm_source=tg`
      );
    }
    return '';
  }

  getFirstMenuTip(): string {
    return (
      `${EMOJI_STARS} Чтобы не тратить время на неподходящие объекты, можешь <b>настрой фильтры через меню.</b>\n` +
      `\n` +
      `Вот, кстати, как оно выглядит ${EMOJI_DOWN}`
    );
  }

  getLandlordMainPageText(hasObject: boolean): string {
    if (hasObject) {
      return (
        `${EMOJI_MAP} <b>Меню</b> - твой главный помощник в навигации по возможностям и функционалу бота.\n` +
        `\n` +
        `${EMOJI_HOUSE} <b>Мое объявление</b> - покажет Ваше объявление и даст его отредактировать.\n` +
        `\n` +
        `${EMOJI_CHECK} <b>Поиск активен/остановлен</b> - позволит Вам остановить и возобновить поиск съемщика.`
      );
    }
    return (
      `${EMOJI_MAP} <b>Меню</b> - твой главный помощник в навигации по возможностям и функционалу бота.\n` +
      `\n` +
      `${EMOJI_HOUSE} <b>Разместить объявление</b> - поможет Вам создать и разместить объявление в нашей платформе, чтобы затем получать анкеты заинтересовавшихся прямо в этот чат.\n` +
      `\n` +
      `${EMOJI_ID} <b>Добавить объявление по ID</b> - если у Вас имеется уникальный ID объявления, укажите его, чтобы прикрепить объявление к Вашему профилю.`
    );
  }

  getLandlordSecondPageText(): string {
    return (
      `${EMOJI_MAP} <b>Меню</b> - твой главный помощник в навигации по возможностям и функционалу бота.\n` +
      `\n` +
      `${EMOJI_STATUS} <b>Изменить статус</b> - поможет тебе изменить статус из арендодателя в арендатора и наоборот.`
    );
  }
}
