import { Injectable } from '@nestjs/common';
import {
  EMOJI_ALERT_GATE,
  EMOJI_ATTENTION,
  EMOJI_BELL,
  EMOJI_CALL_PHONE,
  EMOJI_CAT,
  EMOJI_CELEBRATE,
  EMOJI_CLOCK,
  EMOJI_COMMENT,
  EMOJI_DINAMITE,
  EMOJI_FLOORS,
  EMOJI_FORBIDDEN,
  EMOJI_GENDER,
  EMOJI_HANDS,
  EMOJI_HOUSE_TYPE,
  EMOJI_INFO,
  EMOJI_LOCATION,
  EMOJI_MODERATION,
  EMOJI_MONEY,
  EMOJI_NEIGHBORHOODS,
  EMOJI_OK,
  EMOJI_PHOTOS_OBJECT,
  EMOJI_ROMB,
  EMOJI_ROOMS,
  EMOJI_SAD,
  EMOJI_SUBWAY,
} from '../../constants/emoji';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { getDefaultObjectText } from '../../renter-objects/texts/helpers/object-preview.helpers';
import { LOCATIONS_PHOTO } from '../../constants/imageUrls';

@Injectable()
export class LandlordsTextsService {
  getFirstTipTexts(): [string, string] {
    return [
      `${EMOJI_INFO} Сейчас у нас более <b>1000</b> активных пользователей, среди них обязательно найдется ваш будущий арендатор.`,
      `${EMOJI_HANDS} <b>Я возьму на себя работу риэлторов</b> и помогу максимально сократить время на поиск и общение со съемщиками совершенно <b>бесплатно.</b>\n` +
        `\n` +
        `со мной Вы:\n` +
        `${EMOJI_ROMB} Узнаете информацию (возраст, соцсети, работу и тд.) об арендаторе;\n` +
        `${EMOJI_ROMB} Делитесь своим контактом только с теми, кого одобрили. Без спама!`,
    ];
  }

  getLandlordObjectFormText(object: ApiObjectResponse): string {
    const prefixModeration = !object.isApproved
      ? `<i>${EMOJI_ALERT_GATE} Ваше оъявление находится на модерации. Вскоре я уведомлю о результатах проверки.</i>` +
        '\n\n'
      : '';
    return prefixModeration + getDefaultObjectText(object);
  }

  getNoLandlordObjectFormText(): string {
    return (
      `#home???\n` +
      `<b>???</b>\n` +
      `\n` +
      `${EMOJI_SUBWAY} <i>Метро</i>: ???\n` +
      `${EMOJI_MONEY} <i>Стоимость</i>: ??? руб./мес\n` +
      `${EMOJI_NEIGHBORHOODS} <i>Соседи</i>: ???\n` +
      `\n` +
      `??? + ??? + ???\n` +
      `\n` +
      `${EMOJI_CLOCK} <i>Заезд</i>: ???\n` +
      `${EMOJI_COMMENT} <i>Комментарий</i>: ???\n` +
      `\n`
    );
  }

  getObjectFormNameText(): string {
    return (
      `${EMOJI_ATTENTION} Заполнение анкеты должно происходить только от собственника либо лица, проживающего в квартире.\n` +
      `\n` +
      `Ваше имя?`
    );
  }

  getObjectFormPhoneNumberText(): string {
    return (
      `${EMOJI_CALL_PHONE} Поделитесь <b>номером телефона</b> для регистрации, начиная с "+7"\n` +
      `\n` +
      `P.S. Если у Вас нет никнейма в телеграме (@example), то это будет единственный способ связи с потенциальными арендаторами`
    );
  }

  getObjectFormObjectTypeText(): string {
    return `${EMOJI_HOUSE_TYPE} Выберите <b>тип жилья</b>:`;
  }

  getObjectFormStartArrivalDateText(): string {
    return `${EMOJI_CLOCK} С какого числа возможен <b>заезд</b>? (дд.мм.гггг)`;
  }

  getObjectFormPriceText(): string {
    return `${EMOJI_MONEY} <b>Укажите стоимость</b> месячной аренды в рублях.`;
  }

  getObjectFormLocationText(): string {
    return `<a href="${LOCATIONS_PHOTO}">&#8205;</a>${EMOJI_LOCATION} <b>Локация:</b>`;
  }

  getObjectFormAddressText(): string {
    return (
      `${EMOJI_SUBWAY} Укажите ближайшую <b>станцию метро</b> и время до нее.\n` +
      `\n` +
      `пример: Тверская (~4 мин. пешком)`
    );
  }

  getObjectFormPhotosText(): string {
    return (
      `${EMOJI_PHOTOS_OBJECT} <b>Пришлите фотографии</b> спальни, кухни, ванны, туалета и прочих зон - до <b>10</b> шт.\n` +
      `\n` +
      `${EMOJI_FORBIDDEN} Запрещены фотографии с водяными знаками.`
    );
  }

  getObjectFormDetailsText(): string {
    return (
      `${EMOJI_CAT} <b>Детали об объекте</b>\n` + `\n` + `Выберите детали, которые будут доступны съемщику.`
    );
  }

  getObjectFormRoomsNumberText(): string {
    return `${EMOJI_ROOMS} Укажите <b>количество комнат</b> в квартире.`;
  }

  getObjectFormApartmentsFloorsText(): string {
    return `${EMOJI_FLOORS} Какой у вас <b>этаж</b> и сколько их всего?\n` + `\n` + `пример: 7/22`;
  }

  getObjectFormRoomBedPeopleNumberText(): string {
    return `${EMOJI_NEIGHBORHOODS} <b>Сколько человек проживает</b> в квартире?`;
  }

  getObjectFormRoomBedAverageAgeText(): string {
    return `${EMOJI_NEIGHBORHOODS} Средний возраст проживающих в квартире?`;
  }

  getObjectFormRoomBedPreferredGenderText(): string {
    return `${EMOJI_GENDER} Кого готовы рассмотреть?`;
  }

  getObjectFormCommentText(): string {
    return (
      `${EMOJI_COMMENT} <b>Комментарий в свободной форме.</b>\n` +
      `Тут Вы можете указать коммунальные платежи, информацию о залоге, площадь сдаваемого объекта, рассказать о квартире и соседях, сроках сдачи (если есть), наличие домашних животных, присутствие собственника и прочее.`
    );
  }

  getObjectFormPlaceOnSitesText(placeOnSites: boolean): string {
    return (
      `${EMOJI_CELEBRATE} <b>Объявление готово!</b>\n` +
      `Чтобы поиск съемщика проходил быстрее, а количество анкет было больше, мы можем <b>бесплатно</b> разместить ваше объявление на открытых площадках по аренде жилья.\n` +
      `\n` +
      `${EMOJI_ATTENTION}️ <b>Ваши контакты не увидят</b> пользователи, которых вы не одобрили в этом чате.\n` +
      `\n` +
      `Выбранный статус: <i>${placeOnSites ? 'СОГЛАСЕН' : 'НЕ СОГЛАСЕН'}</i>`
    );
  }

  getObjectFormModerationText(number: number): string {
    return (
      `${EMOJI_MODERATION} <b>Объявление отправлено на модерацию!</b>\n` +
      `Я вернусь к Вам сразу после прохождения проверки.\n` +
      `\n` +
      `Ваш объект - #home${number}\n`
    );
  }

  getModerationDecisionText(isApproved: boolean): string {
    if (!isApproved) {
      return (
        `${EMOJI_SAD} <b>Объявление не прошло модерацию.</b>\n` +
        `Попробуйте прислать более качественные фотографии или исправить ошибки в описании.\n` +
        `\n` +
        `Если возникли вопросы, можете обратиться в поддержку - @homie_admin`
      );
    }
    return (
      `${EMOJI_BELL} <b>Объявление прошло модерацию!</b>\n` +
      `Теперь сюда будут приходить анкеты всех заинтересовавшихся. Если возникнут вопросы, можете обратиться в поддержку.`
    );
  }

  getRenewObjectText(object: ApiObjectResponse): string {
    return (
      `${EMOJI_DINAMITE} <b>Уупс, включился протокол самоуничтожения объявления.</b> Только Вы можете это остановить!\n` +
      `\n` +
      `${EMOJI_ATTENTION} Если объявление #home${object.number} еще актуально - нажмите "<b>актуально</b>". В ином случае я сниму объявление с публикации. Через меню вы сможете снова его активировать.`
    );
  }

  getRenewedText(): string {
    return `${EMOJI_OK} Поиск съемщика продолжается!`;
  }

  getStoppedText(): string {
    return `${EMOJI_OK} Выключил поиск съемщика!`;
  }
}
