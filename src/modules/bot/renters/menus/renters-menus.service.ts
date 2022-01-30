import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../main/interfaces/bot.interface';
import { RentersAfterGenderInterface } from '../interfaces/renters-after-gender.interface';
import { EMOJI_GENDER_MAN, EMOJI_GENDER_WOMAN } from '../constants/emoji';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';

@Injectable()
export class RentersMenusService {
  public genderMenu: Menu<MyContext>;

  initGender(handler: RentersAfterGenderInterface): void {
    this.genderMenu = new Menu<MyContext>('menu-chooseGender')
      .text(`${EMOJI_GENDER_MAN} Мужчина`, async ctx => {
        ctx.menu.close();
        await handler(GenderEnumType.MALE, ctx);
      })
      .text(`${EMOJI_GENDER_WOMAN} Женщина`, async ctx => {
        ctx.menu.close();
        await handler(GenderEnumType.FEMALE, ctx);
      })
      .row();
  }
}
