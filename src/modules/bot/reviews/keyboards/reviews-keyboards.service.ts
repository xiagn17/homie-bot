import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { ReviewReasons } from '../../../api/reviews/interfaces/reviews.type';
import { EMOJI_FIVE, EMOJI_FORM, EMOJI_FOUR, EMOJI_ONE, EMOJI_THREE, EMOJI_TWO } from '../../constants/emoji';
import { LANDLORD_FORM_LINK, RENTER_FORM_LINK } from '../texts/reviews-texts.service';

export const KEYBOARD_REVIEW_REASON_PREFIX = 'kb_reviewReason_';
export const KEYBOARD_REVIEW_STARS_PREFIX = 'kb_reviewStars_';

@Injectable()
export class ReviewsKeyboardsService {
  getReasonsKeyboard(type?: TelegramUserType): InlineKeyboard {
    if (type === TelegramUserType.renter) {
      return new InlineKeyboard()
        .text(`Нашел жилье тут`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.found_here}`)
        .row()
        .text(`Нашел в другом месте`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.found_another}`)
        .row()
        .text(`Изменились планы`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.changed_plans}`)
        .row()
        .text(`Другое`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.other}`);
    } else {
      return new InlineKeyboard()
        .text(`Нашел съемщика тут`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.found_here}`)
        .row()
        .text(`Нашел в другом месте`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.found_another}`)
        .row()
        .text(`Изменились планы`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.changed_plans}`)
        .row()
        .text(`Другое`, `${KEYBOARD_REVIEW_REASON_PREFIX}${ReviewReasons.other}`);
    }
  }

  getStarsKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
      .text(`${EMOJI_ONE}`, `${KEYBOARD_REVIEW_STARS_PREFIX}1`)
      .text(`${EMOJI_TWO}`, `${KEYBOARD_REVIEW_STARS_PREFIX}2`)
      .text(`${EMOJI_THREE}`, `${KEYBOARD_REVIEW_STARS_PREFIX}3`)
      .text(`${EMOJI_FOUR}`, `${KEYBOARD_REVIEW_STARS_PREFIX}4`)
      .text(`${EMOJI_FIVE}`, `${KEYBOARD_REVIEW_STARS_PREFIX}5`);
  }

  async getFormKeyboard(ctx: MyContext): Promise<InlineKeyboard> {
    const type = (await ctx.session).type;
    const url = type === TelegramUserType.renter ? RENTER_FORM_LINK : LANDLORD_FORM_LINK;
    return new InlineKeyboard().url(`${EMOJI_FORM} Заполнить форму`, url);
  }
}
