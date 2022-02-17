import { Injectable } from '@nestjs/common';
import { Middleware } from '@grammyjs/menu/out/deps.node';
import { MyContext } from '../interfaces/bot.interface';
import { BotHandlersService } from '../handlers/bot-handlers.service';
import { RentersHandlersService } from '../../renters/handlers/renters-handlers.service';
import { MainMenuHandlersService } from '../../main-menu/handlers/main-menu-handlers.service';
import { RentersObjectsHandlersService } from '../../renter-objects/handlers/renters-objects-handlers.service';
import { BotKeyboardsService } from '../keyboards/bot-keyboards.service';
import { RentersKeyboardsService } from '../../renters/keyboards/renters-keyboards.service';
import { MainMenuKeyboardsService } from '../../main-menu/keyboards/main-menu-keyboards.service';
import { RentersObjectsKeyboardsService } from '../../renter-objects/keyboards/renters-objects-keyboards.service';

@Injectable()
export class BotMiddlewaresService {
  constructor(
    private readonly botHandlersService: BotHandlersService,
    private readonly botKeyboardsService: BotKeyboardsService,

    private readonly mainMenuHandlersService: MainMenuHandlersService,
    private readonly mainMenuKeyboardsService: MainMenuKeyboardsService,

    private readonly rentersHandlersService: RentersHandlersService,
    private readonly rentersKeyboardsService: RentersKeyboardsService,

    private readonly rentersObjectsHandlersService: RentersObjectsHandlersService,
    private readonly rentersObjectsKeyboardsService: RentersObjectsKeyboardsService,
  ) {}

  get middlewares(): Middleware<MyContext>[] {
    return [
      this.botHandlersService.composer,
      this.botKeyboardsService.chooseUserTypeKeyboard,
      this.botHandlersService.routerUserType,

      this.mainMenuKeyboardsService.renterMainMenu,
      this.mainMenuHandlersService.composer,
      this.mainMenuHandlersService.router,

      this.rentersHandlersService.composer,
      this.rentersKeyboardsService.genderKeyboard,
      this.rentersHandlersService.routerGender,
      this.rentersHandlersService.routerFilters,

      this.rentersObjectsKeyboardsService.payContactsMenu,
      this.rentersObjectsHandlersService.composer,
    ];
  }
}
