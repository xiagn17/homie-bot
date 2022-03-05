import { Injectable } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';
import { EMOJI_GREEN, EMOJI_RED, EMOJI_STOP } from '../../constants/emoji';

export const KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX = 'kb_LLRenterAction_';

@Injectable()
export class LandlordRentersKeyboardsService {
  getRenterActionsKeyboard(renterId: string): InlineKeyboard {
    return new InlineKeyboard()
      .text(
        `${EMOJI_GREEN} Поделиться контактом`,
        `${KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX}submit_${renterId}`,
      )
      .row()
      .text(`${EMOJI_RED} Неинтересно`, `${KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX}decline_${renterId}`)
      .row()
      .text(`${EMOJI_STOP} Остановить поиск`, `${KEYBOARD_LANDLORD_RENTER_ACTIONS_PREFIX}stop_${renterId}`);
  }
}
