import { Injectable, OnModuleInit } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { DefaultHandlerInterface } from '../main/handlers/interfaces/bot-handlers.interface';
import { MyContext } from '../main/interfaces/bot.interface';
import { GenderEnumType } from '../../api/renters/interfaces/renters.type';
import { RentersMenusService } from './menus/renters-menus.service';
import { RentersAfterGenderInterface } from './interfaces/renters-after-gender.interface';
import { EMOJI_GENDER, EMOJI_GENDER_MAN, EMOJI_GENDER_WOMAN } from './constants/emoji';

@Injectable()
export class RentersService implements OnModuleInit {
  menus: Menu<MyContext>[] = [];

  constructor(private rentersMenusService: RentersMenusService) {}

  onModuleInit(): void {
    this.rentersMenusService.initGender(this.afterChooseGender);
    this.menus.push(this.rentersMenusService.genderMenu);
  }

  chooseGender: DefaultHandlerInterface = async ctx => {
    const text = `Некоторые арендодатели рассматривают только женщин либо мужчин. Позволь узнать твой пол ${EMOJI_GENDER}`;
    await ctx.reply(text, {
      reply_markup: this.rentersMenusService.genderMenu,
    });
  };

  private afterChooseGender: RentersAfterGenderInterface = async (gender, ctx) => {
    const session = await ctx.session;
    session.gender = gender;

    const maleText = `<b>Мужчина ${EMOJI_GENDER_MAN}</b>`;
    const femaleText = `<b>Женщина ${EMOJI_GENDER_WOMAN}</b>`;
    const text =
      `Некоторые арендодатели рассматривают только женщин либо мужчин. Позволь узнать твой пол ${EMOJI_GENDER}\n` +
      `Вы ${gender === GenderEnumType.FEMALE ? femaleText : maleText}`;
    await ctx.editMessageText(text);
  };
}
