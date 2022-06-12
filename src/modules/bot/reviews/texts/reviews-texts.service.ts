import { Injectable } from '@nestjs/common';
import { EMOJI_EYES, EMOJI_HEART, EMOJI_HELP, EMOJI_NEXT } from '../../constants/emoji';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { MyContext } from '../../main/interfaces/bot.interface';

export const RENTER_FORM_LINK = 'https://forms.gle/chpr7yJs7bENQJ3q8';
export const LANDLORD_FORM_LINK = 'https://forms.gle/MTN2nB3czDeECkcQ7';

@Injectable()
export class ReviewsTextsService {
  getReasonText(): string {
    return `${EMOJI_HELP} Поделитесь, пожалуйста, причиной остановки поиска.`;
  }

  getStarsText(): string {
    return `${EMOJI_EYES} Как бы ты оценил мою работу 5-балльной шкале?`;
  }

  async getFormText(ctx: MyContext): Promise<string> {
    const type = (await ctx.session).type;
    if (type === TelegramUserType.renter) {
      return (
        `${EMOJI_HEART} Большое спасибо за обратную связь!\n` +
        `\n` +
        `Если найдется пара минут, я буду очень благодарен коротко заполненной <a href='${RENTER_FORM_LINK}'>форме на 3 вопроса</a>. Этим ты сделаешь поиск жилья еще удобнее!\n` +
        `\n` +
        `${EMOJI_NEXT} Возобновить поиск жилья по фильтрам всегда можно через кнопку "Далее", а чтобы не пропустить самые классные объекты, подписывайся на <a href='https://t.me/homie_msk'>наш канал</a>!`
      );
    } else {
      return (
        `${EMOJI_HEART}️ Большое спасибо за обратную связь!\n` +
        `\n` +
        `Если найдется пара минут, я буду очень благодарен коротко заполненной <a href='${LANDLORD_FORM_LINK}'>форме на 3 вопроса</a>. Этим вы сделаете поиск жильцов еще удобнее!\n` +
        `\n` +
        `${EMOJI_NEXT} Возобновить поиск жильцов всегда можно через "Меню".`
      );
    }
  }
}
