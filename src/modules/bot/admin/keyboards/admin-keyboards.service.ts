import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { EMOJI_CHECK, EMOJI_NOT_AGREE, EMOJI_STAR } from '../../constants/emoji';

export const KEYBOARD_ADMIN_MODERATION_SUBMIT_PREFIX = 'kb_adminModerationSubmit_';
export const KEYBOARD_ADMIN_MODERATION_DECLINE_PREFIX = 'kb_adminModerationDecline_';
export const KEYBOARD_ADMIN_OBJECT_STARRED_PREFIX = 'kb_adminObjectStarred_';

@Injectable()
export class AdminKeyboardsService {
  getAdminModerationKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard()
      .text(`${EMOJI_CHECK} Подтвердить`, `${KEYBOARD_ADMIN_MODERATION_SUBMIT_PREFIX}${objectId}`)
      .text(`${EMOJI_NOT_AGREE} Отклонить`, `${KEYBOARD_ADMIN_MODERATION_DECLINE_PREFIX}${objectId}`);
  }

  getAdminObjectStarredKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard().text(
      `${EMOJI_STAR} Супер-объект`,
      `${KEYBOARD_ADMIN_OBJECT_STARRED_PREFIX}${objectId}`,
    );
  }
}
