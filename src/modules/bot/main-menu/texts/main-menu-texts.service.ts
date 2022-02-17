import { Injectable } from '@nestjs/common';
import {
  EMOJI_FILTER,
  EMOJI_INFO,
  EMOJI_LOOPA,
  EMOJI_MAP,
  EMOJI_PHONE,
  EMOJI_STATUS,
  EMOJI_WOMAN_HAND,
} from '../../constants/emoji';

@Injectable()
export class MainMenuTextsService {
  getRenterMainPageText(): string {
    return (
      `${EMOJI_MAP} <b>Меню</b> - твой главный помощник в навигации по возможностям и функционалу бота.\n` +
      `\n` +
      `${EMOJI_FILTER}️ <b>Фильтр</b> - позволит показывать только те объявления, которые соответствуют настройкам.\n` +
      `\n` +
      `${EMOJI_WOMAN_HAND}️ <b>Анкета</b> - это твоя анкета, которую я буду отправлять арендодателем заинтересовавшихся объявлений.`
    );
  }

  getRenterSecondPageText(): string {
    return (
      `${EMOJI_MAP} <b>Меню</b> - твой главный помощник в навигации по возможностям и функционалу бота.\n` +
      `\n` +
      `${EMOJI_LOOPA} <b>Поиск по ID</b> - позволит найти конкретный объект по тегу #home...\n` +
      `\n` +
      `${EMOJI_STATUS} <b>Изменить статус</b> - поможет тебе изменить статус из арендатора в арендодателя и наоборот.`
    );
  }

  getAboutUsText(): string {
    return (
      `${EMOJI_INFO} <b>Без посредников и риелторов</b> я собираю внутри себя базу комнат и квартир из открытых источников (групп ФБ и ВК, Циан и пр.) и внутренней базы Homie по всей Москве, чтобы затем отсортировать для тебя самые подходящие варианты!\n` +
      `\n` +
      `${EMOJI_PHONE} <b>Контакты:</b>\n` +
      `тг канал - <a href='https://t.me/homie_msk'>@homie_msk</a>\n` +
      `instagram - <a href='https://instagram.com/homie.rf'>instagram.com/homie.rf</a>\n` +
      `сайт: <a href='https://my-homie.ru/?utm_source=tg'>my-homie.ru/?utm_source=tg</a>`
    );
  }

  getFirstMenuTip(): string {
    return (
      `Пришло время показать тебе центр управления.\n` +
      `\n` +
      `${EMOJI_INFO} Через <b>Меню</b> ты можешь настроить <b>фильтры</b> объявлений и заполнить свою <b>анкету</b>.`
    );
  }
}
