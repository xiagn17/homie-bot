import { Injectable } from '@nestjs/common';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import {
  EMOJI_CHECK,
  EMOJI_CLOCKS_SAND,
  EMOJI_GREEN_BOOM,
  EMOJI_KEY,
  EMOJI_LOOPA,
  EMOJI_MEDAL,
  EMOJI_OK,
  EMOJI_REFUND_GARRANTY,
  EMOJI_SAD,
  EMOJI_SEND_REQUEST,
  EMOJI_SHARE,
  EMOJI_SPEAK,
} from '../../constants/emoji';
import { RU_LOCALE } from '../../../../utils/locales';
import { getDefaultObjectText } from './helpers/object-preview.helpers';

@Injectable()
export class RenterObjectsTextsService {
  getObjectText(object: ApiObjectResponse): string {
    const validatedByRobot = `${EMOJI_CHECK} <i><a href="https://telegra.ph/Provereno-robotommoderatorom-02-20">Проверено роботом</a></i>`;
    const report = ` / <i><a href='https://t.me/homie_admin'>Пожаловаться</a></i>`;
    return getDefaultObjectText(object) + '\n' + validatedByRobot + report;
  }

  getObjectsEnded(): string {
    return (
      `${EMOJI_MEDAL} Похоже, <b>ты посмотрел все подходящие объявления.</b>\n` +
      'Можешь расширить фильтр, либо дождаться новых объектов - я сразу поделюсь ими с тобой!'
    );
  }

  getNoRenterInfoText(): string {
    return `<b>${EMOJI_SEND_REQUEST} Твоя анкета еще не заполнена.</b> Чтобы получить контакт этого арендодателя, необходимо отправить ему заполненную анкету.\n`;
  }

  getSendRequestTrialStartedText(objectNumber: number, trialEndsAt: Date): string {
    return (
      `#home${objectNumber}\n` +
      `<b>${EMOJI_GREEN_BOOM} Я отправил твою анкету автору объявления!</b> С этого момента у тебя начался бесплатный пробный период 7 дней.\n` +
      `\n` +
      `😌 ${trialEndsAt.toLocaleDateString(
        RU_LOCALE,
      )} вы сможете продлить подписку, если еще будет необходимость.`
    );
  }

  getSendRequestTrialStartedAdminObjectText(objectNumber: number, trialEndsAt: Date): string {
    return (
      `#home${objectNumber}\n` +
      `${EMOJI_GREEN_BOOM}️ <b>Этот объект был проверен и добавлен модераторами.</b> Арендодатель оповещен. Можешь отправить ему свою анкету, чтобы в удобной форме рассказать о себе.\n` +
      `\n` +
      `😌 С этого момента у тебя начался бесплатный пробный период 7 дней. ${trialEndsAt.toLocaleDateString(
        RU_LOCALE,
      )} вы сможете продлить подписку, если будет необходимость.\n`
    );
  }

  getContactObjectText(object: LandlordObjectEntity): string {
    const est_kontakt_text = `<b>Есть контакт арендодателя!</b>\n`;
    const object_number_text = `🏡 Посмотреть объявление --> #home${object.number}`;
    const getNameText = (name: string): string => `👋🏻 Имя: ${name}\n`;
    const getContactText = (
      { username, phoneNumber }: { username: string | null; phoneNumber: string },
      socials?: string,
    ): string => {
      if (socials) {
        return `🌐 Контакты: ${socials}\n\n`;
      }
      return `🎊 Контакт разместившего: ${username ? `@${username}` : phoneNumber}\n\n`;
    };

    let message = est_kontakt_text;

    const isObjectFromAdmin = object.isAdmin;
    if (isObjectFromAdmin) {
      const landlordName = object.name.split('-')[0].trim();
      const landlordSocials = object.name.split('-')[1].trim();
      message =
        message +
        getNameText(landlordName) +
        getContactText({ username: '', phoneNumber: '' }, landlordSocials) +
        object_number_text;
    } else {
      message =
        message +
        getNameText(object.name) +
        getContactText({
          username: object.telegramUser.username,
          phoneNumber: object.phoneNumber,
        }) +
        object_number_text;
    }

    return message;
  }

  getNoSubscriptionText(): string {
    return (
      `${EMOJI_CLOCKS_SAND} <b>Пробный период пользования закончился</b>\n` +
      `Вы продолжите получать проверенные объявления от собственников, но чтобы откликнуться, потребуется активировать подписку.\n` +
      `\n` +
      `Только <b>ликвидные</b> варианты жилья. Мы мониторим все социальные сети и площадки по аренде недвижимости.\n` +
      `\n` +
      `${EMOJI_REFUND_GARRANTY} <b>Гарантия возврата</b>. В случае, если Вы попадете на риелтора по нашему объекту вернем всю стоимость!\n` +
      `\n` +
      `<b>Сэкономьте до 99%</b> на оплату риелтору, с подпиской Homie!\n` +
      `<a href='https://telegra.ph/Statusy-v-Homie-05-05'>Подробнее о подписке Homie</a>\n` +
      `<a href='https://t.me/+2l9J_xnwQx8zYmEy'>Отзывы</a> | <a href='https://my-homie.ru/'>Наш сайт</a>\n` +
      `\n` +
      `🧨 <b>Успей приобрести по скидке до 50% до конца недели!</b>`
    );
  }

  getStoppedRenterSearchText(): string {
    return `${EMOJI_OK} Поиск жилья <b>приостановлен.</b>`;
  }

  getIdInterestedObjectText(): string {
    return `${EMOJI_LOOPA} Укажи ID заинтересовавшегося объявления.\n` + `\n` + 'Пример: home123';
  }

  getNotFoundObjectText(): string {
    return (
      `${EMOJI_SAD} К сожалению, данное объявление недавно было снято с публикации.\n` +
      `Но не расстраивайся! Мы обязательно что-нибудь найдем!`
    );
  }

  getFreeSubscriptionText(): string {
    return (
      `${EMOJI_SPEAK} Расскажи обо мне своим друзьям и получи подписку <b>Homie</b> совершенно бесплатно!\n` +
      `\n` +
      `${EMOJI_KEY} Что ты получишь?\n` +
      `1 день доступа - за друга, который заполнил анкету\n` +
      `1 неделя доступа - за instagram stories с ссылкой на меня\n` +
      `1 неделя доступа - за друга, который разместил объект на Homie\n` +
      `\n` +
      `${EMOJI_SHARE} Поделиться Homie ты сможешь в любое время через:\n` +
      `/menu --> Прочее --> Поделиться Homie`
    );
  }
}
