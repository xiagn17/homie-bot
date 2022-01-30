import { Injectable, OnModuleInit } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
// import { DefaultHandlerInterface } from '../handlers/interfaces/bot-handlers.interface';
import { MyContext } from '../main/interfaces/bot.interface';
import { LandlordsMenusService } from './menus/landlords-menus.service';

@Injectable()
export class LandlordsService implements OnModuleInit {
  menus: Menu<MyContext>[] = [];

  constructor(private landlordsMenusService: LandlordsMenusService) {}

  onModuleInit(): void {
    console.log(this.landlordsMenusService);
    // this.landlordsMenusService.initGender();
    // this.menus.push(this.landlordsMenusService.genderMenu);
  }

  // first: DefaultHandlerInterface = async ctx => {
  // const text = 'Некоторые арендодатели рассматривают только женщин либо мужчин. Позволь узнать твой пол 🚻';
  // await ctx.reply(text, {
  //   reply_markup: this.rentersMenusService.genderMenu,
  // });
  // };
}
