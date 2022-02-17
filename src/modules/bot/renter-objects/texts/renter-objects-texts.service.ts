import { Injectable } from '@nestjs/common';
import { ApiObjectPreviewInterface } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import {
  EMOJI_CLOCK,
  EMOJI_COMMENT,
  EMOJI_GREEN_BOOM,
  EMOJI_HOLMS_WOMAN,
  EMOJI_LIGHTNING,
  EMOJI_MEDAL,
  EMOJI_MONEY,
  EMOJI_PLUS,
  EMOJI_SEND_REQUEST,
  EMOJI_STAR,
  EMOJI_SUBWAY,
} from '../../constants/emoji';
import { getDetailsRow, getFiveRow, getSecondRow } from './helpers/object-preview.helpers';

@Injectable()
export class RenterObjectsTextsService {
  getPreviewObjectText(object: ApiObjectPreviewInterface): string {
    const firstRow = `#home${object.number}${object.isAdmin ? ' <i>(админ.)</i>' : ''}` + '\n';
    const secondRow = getSecondRow(object) + '\n\n';
    const thirdRow = `${EMOJI_SUBWAY} <i>Метро</i>: ${object.address}` + '\n';
    const fourRow = `${EMOJI_MONEY} <i>Стоимость</i>: ${object.price}` + '\n';
    const fiveRow = getFiveRow(object) + '\n';
    const detailsRow = getDetailsRow(object) + '\n\n';
    const arrivalRow = `${EMOJI_CLOCK} <i>Заезд</i>: с ${object.startArrivalDate}` + '\n';
    const commentRow = `${EMOJI_COMMENT} <i>Комментарий</i>: ${object.comment}` + '\n';
    return firstRow + secondRow + thirdRow + fourRow + fiveRow + detailsRow + arrivalRow + commentRow;
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

  getSendRequestText(): string {
    return (
      `<b>${EMOJI_GREEN_BOOM} Я отправил твою анкету автору</b> объявления! Если он одобрит анкету, я пришлю тебе его контакт.\n` +
      `\n` +
      `${EMOJI_LIGHTNING}️ <b>Чтобы получить контакт сразу</b> - жми "получить контакт"`
    );
  }

  getSendRequestAdminObjectText(): string {
    return (
      `${EMOJI_GREEN_BOOM} <b>Этот объект был проверен и добавлен модераторами.</b> Арендодатель оповещен. Если в течение следующих 8 часов он не зайдет в бота, я автоматически поделюсь контактом <b>со всеми заинтересовавшимися!</b>\n` +
      `\n` +
      `${EMOJI_LIGHTNING}️ <b>Чтобы получить контакт сразу</b> - жми "получить контакт"`
    );
  }

  getContactObjectText(object: LandlordObjectEntity): string {
    const est_kontakt_text = `<b>Есть контакт!</b>\n\n`;
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
      `${EMOJI_MEDAL} <b>Хорошие объекты разлетаются очень быстро.</b> Чтобы увеличить свои шансы - получи контакт сразу.\n` +
      `\n` +
      `${EMOJI_PLUS} Арендодатель получит твою анкету с пометкой о высокой заинтересованности!\n` +
      `\n` +
      `${EMOJI_LIGHTNING}️ Если вдруг объект окажется неактуальным (рынок динамичен) - мы БЕСПЛАТНО дадим доступ к другому.\n` +
      `\n` +
      `<a href='https://telegra.ph/Rasskazyvaem-o-tarifah-Homie-02-10'>Подробнее о тарифах Homie.</a>`
    );
  }

  getPrivateHelperText(): string {
    return (
      `${EMOJI_HOLMS_WOMAN} <b>Личный помощник</b> прозвонит все объявления, подходящие твоему индивидуальному запросу, на разных площадках и будет присылать тебе ежедневную подборку <b>в течение 2 недель!</b>\n` +
      `\n` +
      `${EMOJI_STAR} <b>Бонусом:</b>\n` +
      `* проверка объекта\n` +
      `* организация показов\n` +
      `* проверку собственника\n` +
      `* составление договора аренды\n` +
      `\n` +
      `<a href='https://telegra.ph/Rasskazyvaem-o-tarifah-Homie-02-10'>Подробнее о тарифах Homie.</a>`
    );
  }
}
