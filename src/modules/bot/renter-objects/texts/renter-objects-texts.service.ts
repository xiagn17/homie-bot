import { Injectable } from '@nestjs/common';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import {
  EMOJI_CHECK,
  EMOJI_GREEN_BOOM,
  EMOJI_KEY,
  EMOJI_LIGHTNING,
  EMOJI_LOOPA,
  EMOJI_MEDAL,
  EMOJI_OK,
  EMOJI_SAD,
  EMOJI_SEND_REQUEST,
  EMOJI_SHARE,
  EMOJI_SPEAK,
} from '../../constants/emoji';
import { getDefaultObjectText } from './helpers/object-preview.helpers';

@Injectable()
export class RenterObjectsTextsService {
  getObjectText(object: ApiObjectResponse, ableContacts: number): string {
    const contactsAble = `${EMOJI_KEY} <i>Доступно контактов:</i> ${ableContacts}`;
    const validatedByRobot = `${EMOJI_CHECK} <i><a href="https://telegra.ph/Provereno-robotommoderatorom-02-20">Проверено роботом</a></i>`;
    const report = ` / <i><a href='https://t.me/homie_admin'>Пожаловаться</a></i>`;
    return getDefaultObjectText(object) + '\n' + validatedByRobot + report + '\n' + contactsAble;
  }

  getObjectsEnded(): string {
    return (
      `${EMOJI_MEDAL} Похоже, <b>ты посмотрел все подходящие объявления.</b>\n` +
      'Можешь расширить фильтр, либо дождаться новых объектов - я сразу поделюсь ими с тобой!'
    );
  }

  getNoRenterInfoText(): string {
    return (
      `<b>${EMOJI_SEND_REQUEST} Твоя анкета еще не заполнена.</b> Чтобы получить контакт этого арендодателя, необходимо отправить ему заполненную анкету.\n` +
      `\n` +
      `${EMOJI_LIGHTNING} <b>Чтобы получить контакт сразу</b> - жми "получить контакт"`
    );
  }

  getSendRequestText(objectNumber: number): string {
    return (
      `#home${objectNumber}\n` +
      `<b>${EMOJI_GREEN_BOOM} Я отправил твою анкету автору объявления!</b> Если он одобрит анкету, я пришлю тебе его контакт.\n` +
      `\n` +
      `${EMOJI_LIGHTNING}️ <b>Чтобы получить контакт сразу</b> - жми "получить контакт"`
    );
  }

  getSendRequestAdminObjectText(objectNumber: number): string {
    return (
      `#home${objectNumber}\n` +
      `${EMOJI_GREEN_BOOM} <b>Этот объект был проверен и добавлен модераторами.</b> Арендодатель оповещен. Если в течение следующих 8 часов он не зайдет в бота, я автоматически поделюсь контактом <b>со всеми заинтересовавшимися!</b>\n` +
      `\n` +
      `${EMOJI_LIGHTNING}️ <b>Чтобы получить контакт сразу</b> - жми "получить контакт"`
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

  getNoContactsPayWindowText(): string {
    return (
      `${EMOJI_KEY} <b>Хорошие объекты разлетаются очень быстро.</b> Чтобы увеличить свои шансы - получи контакт сразу.\n` +
      `Арендодатель получит твою анкету с пометкой о высокой заинтересованности!\n` +
      `\n` +
      `${EMOJI_LIGHTNING}️ Если купленный объект окажется неактуальным (рынок динамичен) - мы <b>бесплатно</b> дадим доступ к другому. <a href='https://telegra.ph/Rasskazyvaem-o-tarifah-Homie-02-10'>Подробнее о тарифах Homie.</a>`
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

  getFreeContactsText(): string {
    return (
      `${EMOJI_SPEAK} Расскажи обо мне своим друзьям и получили мгновенные контакты совершенно бесплатно!\n` +
      `\n` +
      `${EMOJI_KEY} Сколько контактов ты получишь?\n` +
      `1 контакт - за друга, который нажал /start\n` +
      `2 контакта - за друга, который заполнил анкету\n` +
      `3 контакта - за друга, который разместил объект на Homie\n` +
      `\n` +
      `${EMOJI_KEY} Приведенный друг также получит 1 контакт!\n` +
      `\n` +
      `${EMOJI_SHARE} Поделиться Homie и получить контакты ты сможешь в любое время через:\n` +
      `/menu --> Прочее --> Поделиться Homie`
    );
  }
}
