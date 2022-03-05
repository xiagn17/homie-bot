import { Injectable } from '@nestjs/common';
import { EMOJI_GREEN, EMOJI_OK, EMOJI_RED } from '../../constants/emoji';

@Injectable()
export class LandlordRentersTextsService {
  getDeclinedRenterText(renterInfoText: string): string {
    const postfix = '\n_____________\n' + `${EMOJI_RED}  Ваш контакт <b>не был отправлен</b>`;
    return renterInfoText + postfix;
  }

  getSubmitRenterText(renterInfoText: string): string {
    const postfix = '\n_____________\n' + `${EMOJI_GREEN}  Ваш контакт <b>был отправлен</b>`;
    return renterInfoText + postfix;
  }

  getStopObjectText(): string {
    return `${EMOJI_OK} Выключил поиск съемщика!`;
  }
}
