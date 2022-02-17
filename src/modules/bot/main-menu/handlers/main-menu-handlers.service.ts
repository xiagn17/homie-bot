import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer } from 'grammy';
import { Router } from '@grammyjs/router';
import { MyContext } from '../../main/interfaces/bot.interface';
import { MainMenuService } from '../main-menu.service';
import {
  HandlerOnBackToMainMenu,
  HandlerOnFilters,
  HandlerOnGetMenu,
  HandlerOnNextObject,
  HandlerOnRenterInfo,
} from '../interfaces/main-menu-handlers.interface';
import { MainMenuKeyboardsService } from '../keyboards/main-menu-keyboards.service';
import { RenterObjectsService } from '../../renter-objects/renter-objects.service';
import { RentersService } from '../../renters/renters.service';
import { RentersKeyboardsService } from '../../renters/keyboards/renters-keyboards.service';
import { RentersHandlersService } from '../../renters/handlers/renters-handlers.service';

const ROUTE_MENU_TIP = 'first-menu-tip';
@Injectable()
export class MainMenuHandlersService implements OnModuleInit {
  public composer: Composer<MyContext> = new Composer<MyContext>();

  public router: Router<MyContext> = new Router<MyContext>(async ctx => {
    const renterSession = (await ctx.session).renter;
    const isTimeToShowMenu = renterSession.viewedObjects === 3 && !renterSession.firstMenuTip;
    const route1 = isTimeToShowMenu ? ROUTE_MENU_TIP : null;
    return route1 ?? '';
  });

  constructor(
    private readonly mainMenuService: MainMenuService,
    private readonly mainMenuKeyboardsService: MainMenuKeyboardsService,

    private readonly renterObjectsService: RenterObjectsService,
    private readonly rentersService: RentersService,
    private readonly rentersHandlersService: RentersHandlersService,
    private readonly rentersKeyboardsService: RentersKeyboardsService,
  ) {}

  onModuleInit(): void {
    this.composer.command('menu', this.onGetMenuHandler);

    this.router.route(ROUTE_MENU_TIP, this.mainMenuService.getFirstMenuTip);

    this.rentersKeyboardsService.initRenterInfoKeyboard(
      this.rentersHandlersService.onFillInfoHandler,
      this.mainMenuService.getMenu,
      this.rentersService.sendUpdateName,
      this.rentersService.sendUpdateSocials,
      this.rentersService.sendUpdateLifestyle,
      this.rentersService.sendUpdateProfession,
      this.rentersService.sendUpdateAbout,
      this.rentersService.sendUpdatePhoto,
    );
    this.rentersKeyboardsService.initFiltersKeyboard(
      this.onBackToMainMenuHandler,
      this.rentersHandlersService.onFiltersObjectTypesHandler,
      this.rentersService.sendFiltersPriceQuestion,
      this.rentersService.sendFiltersLocationQuestion,
      this.rentersHandlersService.onFiltersLocationHandler,
      this.onFiltersHandler,
    );
    this.mainMenuKeyboardsService.initRenterMainMenu(
      this.onNextObjectHandler,
      this.onFiltersHandler,
      this.rentersKeyboardsService.filtersKeyboard,
      this.rentersKeyboardsService.renterInfoKeyboard,
      this.onSendRenterInfo,
    );
  }

  onGetMenuHandler: HandlerOnGetMenu = async ctx => {
    await this.mainMenuService.getMenu(ctx);
  };

  onNextObjectHandler: HandlerOnNextObject = async ctx => {
    await this.renterObjectsService.sendNextObject(ctx);
  };

  onFiltersHandler: HandlerOnFilters = async ctx => {
    const text = await this.rentersService.getFiltersText(ctx);
    await ctx.editMessageText(text);
  };

  onSendRenterInfo: HandlerOnRenterInfo = async ctx => {
    await this.rentersService.sendRenterInfoMessage(ctx);
  };

  onBackToMainMenuHandler: HandlerOnBackToMainMenu = async ctx => {
    const text = await this.mainMenuService.getMenuText(ctx);
    await ctx.editMessageText(text);
  };
}
