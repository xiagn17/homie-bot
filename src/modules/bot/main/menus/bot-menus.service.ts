import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../interfaces/bot.interface';
import { RentersService } from '../../renters/renters.service';
import { BotHandlersService } from '../handlers/bot-handlers.service';

@Injectable()
export class BotMenusService {
  constructor(private rentersService: RentersService, private botHandlersService: BotHandlersService) {}

  get menus(): Menu<MyContext>[] {
    return [...this.rentersService.menus, ...this.botHandlersService.menus];
  }
}
