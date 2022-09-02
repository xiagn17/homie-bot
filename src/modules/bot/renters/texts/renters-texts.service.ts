import { Injectable } from '@nestjs/common';
import { ApiRenterFilters } from '../../../api/renters/interfaces/renter-filters.interface';
import { ApiRenterFullInfo } from '../../../api/renters/interfaces/renter-info.interface';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';
import {
  EMOJI_ATTENTION,
  EMOJI_CAT,
  EMOJI_CELEBRATE,
  EMOJI_COMMENT,
  EMOJI_CONGRATS,
  EMOJI_FILTER,
  EMOJI_GENDER,
  EMOJI_GENDER_MAN,
  EMOJI_GENDER_WOMAN,
  EMOJI_GLOBUS,
  EMOJI_HI,
  EMOJI_HOUSE_TYPE,
  EMOJI_LOCATION,
  EMOJI_MONEY,
  EMOJI_PHONE,
  EMOJI_PHOTOS,
  EMOJI_PHOTOS_LIMIT,
  EMOJI_PROFESSION,
  EMOJI_STICK,
  EMOJI_SUPER,
} from '../../constants/emoji';
import { GENDER_TEXT_MAP, OBJECT_TYPE_TEXT_MAP } from '../../constants/texts';
import { LOCATIONS_PHOTO } from '../../constants/imageUrls';
import { getAgeText } from '../../../../utils/texts/get-age-text.helper';
import { RenterReferralsEnum } from '../../../api/renters/interfaces/renter-referrals.interface';
import { RU_LOCALE } from '../../../../utils/locales';
import { getLifestyleRow } from './helpers/renter-info-lifestyle.helper';

@Injectable()
export class RentersTextsService {
  getNameQuestionText(): string {
    return `${EMOJI_HI} <b>Как тебя зовут?</b>`;
  }

  getBirthdayYearQuestionText(): string {
    return `${EMOJI_HI} <b>Год твоего рождения?</b>`;
  }

  getPhoneNumberQuestionText(): string {
    return (
      `${EMOJI_PHONE} Поделись <b>номером телефона</b> для регистрации, начиная с "+7"\n` +
      `\n` +
      `P.S. Если у тебя нет никнейма в телеграме (@example), то это будет единственный способ связи с потенциальными арендодателями.`
    );
  }

  getSocialsQuestionText(): string {
    return (
      `${EMOJI_GLOBUS} <b>Укажи ссылку на свой профиль instagram</b> (или другой соцсети)\n` +
      `\n` +
      `Открытый аккаунт кратно увеличит шансы на одобрение твоей анкеты!\n` +
      `\n` +
      `<b>пример:</b> <a href="https://instagram.com/homie.rf">https://instagram.com/homie.rf</a>`
    );
  }

  getLifestyleQuestionText(): string {
    return `${EMOJI_CAT} Особенности и образ жизни:\n\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
  }

  getProfessionQuestionText(): string {
    return `${EMOJI_PROFESSION} <b>Работаешь/Учишься?</b> Расскажи кем/на кого и где.`;
  }

  getAboutQuestionText(): string {
    return (
      `${EMOJI_COMMENT} <b>О себе:</b>\n` +
      `\n` +
      `Напиши тут то, что не охватила анкета:\n` +
      `- опиши свои интересы и привычки\n` +
      `- как долго планируешь снимать\n` +
      `- каким составом\n` +
      `и прочее...`
    );
  }

  getPhotosQuestionText(withPhoto: boolean): string {
    const additional = withPhoto
      ? `\n` + `${EMOJI_PHOTOS_LIMIT} Вы можете подтвердить ваш выбор или приложить другое фото.`
      : '';
    return `${EMOJI_PHOTOS} Осталось украсить твою анкету <b>фотографией.</b>` + additional;
  }

  getFiltersText(filters: ApiRenterFilters): string {
    const types =
      filters.objectType === null || filters.objectType.length === 0
        ? '???'
        : filters.objectType.map(type => OBJECT_TYPE_TEXT_MAP[type]).join(', ');
    const money =
      filters.priceRangeStart === null || filters.priceRangeEnd === null
        ? '???'
        : `${filters.priceRangeStart}-${filters.priceRangeEnd}`;
    const locations =
      filters.locations === null || filters.locations.length === 0 ? '???' : filters.locations.join(', ');
    return (
      `${EMOJI_FILTER}️ <b>Настройки фильтра объявлений:</b>\n` +
      `\n` +
      `${EMOJI_HOUSE_TYPE} <i>Тип жилья:</i> ${types}\n` +
      `${EMOJI_MONEY} <i>Бюджет:</i> ${money} ₽\n` +
      `${EMOJI_LOCATION} <i>Локация:</i> ${locations}`
    );
  }

  getFiltersPriceQuestionText(): string {
    return (
      `${EMOJI_MONEY} Какой минимальный и максимальный <b>ежемесячный бюджет</b> закладываешь на аренду? (в тысячах рублей)\n` +
      `\n` +
      `<b>пример сообщения:</b> \n` +
      `25-35`
    );
  }

  getFiltersLocationQuestionText(): string {
    return `<a href="${LOCATIONS_PHOTO}">&#8205;</a>${EMOJI_LOCATION} Локация:`;
  }

  getRenterInfoText(renterInfo?: ApiRenterFullInfo): string {
    const defaultResponse = '???';
    const name = renterInfo?.name ?? defaultResponse;
    const age = renterInfo?.birthdayYear
      ? getAgeText(new Date().getFullYear() - renterInfo.birthdayYear)
      : `${defaultResponse} лет`;
    const gender = renterInfo?.gender ? GENDER_TEXT_MAP[renterInfo.gender] : defaultResponse;
    const socials = renterInfo?.socials ?? defaultResponse;
    const profession = renterInfo?.profession ?? defaultResponse;
    const about = renterInfo?.about ?? defaultResponse;
    const username = renterInfo?.username ? `@${renterInfo.username}` : defaultResponse;
    const lifestyle = renterInfo?.lifestyle
      ? getLifestyleRow(renterInfo.lifestyle)
      : `${defaultResponse} | ${defaultResponse} | ${defaultResponse}`;
    return (
      `${EMOJI_HI} <b>${name}</b>, ${age}, ${gender}\n` +
      `${EMOJI_GLOBUS} <i>Socials</i>: ${socials}\n` +
      `\n` +
      `${lifestyle}\n` +
      `\n` +
      `${EMOJI_PROFESSION} <i>Работа/Учеба</i>: ${profession}\n` +
      `${EMOJI_COMMENT} <i>О себе</i>: ${about}\n` +
      `\n` +
      `${EMOJI_GLOBUS} <b>telegram:</b> ${username}\n`
    );
  }

  getRenterInfoForCopyText(renterInfo?: ApiRenterFullInfo): string {
    const mainText = this.getRenterInfoText(renterInfo);
    return (
      `<code>` + mainText + `\n` + `Сформировано с помощью https://t.me/Homie_robot?start=ref_ank</code>`
    );
  }

  getCopyText(): string {
    return `${EMOJI_STICK} Этот арендодатель еще <b>не увидел твою анкету.</b> Чтобы не тратить время на рассказ о себе, можешь <b>скопировать свою анкету</b>, кликнув на любое место в тексте, и отправить ему.`;
  }

  getFirstRenterInfoTip(text: string): string {
    return `${EMOJI_ATTENTION}️ На основе этой анкеты арендодатели Homie будут <b>принимать решение</b>, делиться с тобой контактом, либо нет.\n\n${text}`;
  }

  getGenderText(gender?: GenderEnumType | null): string {
    const maleText = `<b>Мужчина ${EMOJI_GENDER_MAN}</b>`;
    const femaleText = `<b>Женщина ${EMOJI_GENDER_WOMAN}</b>`;

    const mainText = `${EMOJI_GENDER} Некоторые арендодатели рассматривают только женщин либо мужчин. Позволь узнать твой пол.`;
    if (gender) {
      return mainText + `\nВы ${gender === GenderEnumType.FEMALE ? femaleText : maleText}`;
    }
    return mainText;
  }

  getSuccessfulFilledInfoAfterObjectRequestText(): string {
    return `${EMOJI_CELEBRATE} <b>Супер!</b> Ты заполнил анкету, отправляю твой запрос по объекту...`;
  }

  getSuccessfulAutoFilledInfo(): string {
    return `${EMOJI_CELEBRATE} Мы заполнили анкету за тебя, но ты сможешь изменить её, кликнув по соответствующему пункту`;
  }

  getReferralDaysText(from: RenterReferralsEnum): string {
    if (from === RenterReferralsEnum.onFillRenterInfo) {
      return (
        `${EMOJI_CONGRATS} Ура, твой друг заполнил анкету.\n` + `\n` + `Подписка продлена ещё на 1 день!`
      );
    } else if (from === RenterReferralsEnum.onFillLandlordObject) {
      return (
        `${EMOJI_CONGRATS} Ура, твой друг разместил объявление.\n` + `\n` + `Подписка продлена ещё на 7 дней!`
      );
    }
    return '';
  }

  getSubscriptionStartedText(endsAt: Date): string {
    const endsAtText = endsAt.toLocaleDateString(RU_LOCALE);
    return (
      `${EMOJI_SUPER} Все прошло успешно.\n` +
      `Можешь пользоваться всеми моими возможностями до окончания срока подписки. (${endsAtText})`
    );
  }
}
