import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer } from 'grammy';
import { Router } from '@grammyjs/router';
import { MyContext } from '../../main/interfaces/bot.interface';
import { MainMenuService } from '../main-menu.service';
import {
  HandlerOnAbout,
  HandlerOnBackToMainMenu,
  HandlerOnFilters,
  HandlerOnGetMenu,
  HandlerOnLandlordObject,
  HandlerOnNextObject,
  HandlerOnOther,
  HandlerOnRenterInfo,
} from '../interfaces/main-menu-handlers.interface';
import { MainMenuKeyboardsService } from '../keyboards/main-menu-keyboards.service';
import { RenterObjectsService } from '../../renter-objects/renter-objects.service';
import { RentersService } from '../../renters/renters.service';
import { RentersKeyboardsService } from '../../renters/keyboards/renters-keyboards.service';
import { RentersHandlersService } from '../../renters/handlers/renters-handlers.service';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { MainMenuTextsService } from '../texts/main-menu-texts.service';
import { LandlordsService } from '../../landlords/landlords.service';
import { LandlordsKeyboardsService } from '../../landlords/keyboards/landlords-keyboards.service';
import { LandlordsHandlersService } from '../../landlords/handlers/landlords-handlers.service';
import { BotKeyboardsService } from '../../main/keyboards/bot-keyboards.service';
import { BotHandlersService } from '../../main/handlers/bot-handlers.service';
import { RentersObjectsHandlersService } from '../../renter-objects/handlers/renters-objects-handlers.service';

const ROUTE_MENU_TIP = 'first-menu-tip';
@Injectable()
export class MainMenuHandlersService implements OnModuleInit {
  public composer: Composer<MyContext> = new Composer<MyContext>();

  public router: Router<MyContext> = new Router<MyContext>(async ctx => {
    const session = await ctx.session;
    const renterSession = session.renter;
    const userType = session.type;
    const isTimeToShowMenu =
      renterSession.viewedObjects === 2 &&
      !renterSession.firstMenuTip &&
      userType === TelegramUserType.renter;
    const route1 = isTimeToShowMenu ? ROUTE_MENU_TIP : undefined;
    return route1;
  });

  constructor(
    private readonly mainMenuService: MainMenuService,
    private readonly mainMenuKeyboardsService: MainMenuKeyboardsService,
    private readonly mainMenuTextsService: MainMenuTextsService,

    private readonly renterObjectsService: RenterObjectsService,
    private readonly rentersService: RentersService,
    private readonly rentersHandlersService: RentersHandlersService,
    private readonly rentersKeyboardsService: RentersKeyboardsService,

    private readonly landlordsService: LandlordsService,
    private readonly landlordsKeyboardsService: LandlordsKeyboardsService,
    private readonly landlordsHandlersService: LandlordsHandlersService,

    private readonly rentersObjectsHandlersService: RentersObjectsHandlersService,

    private readonly botKeyboardsService: BotKeyboardsService,
    private readonly botHandlersService: BotHandlersService,
  ) {}

  onModuleInit(): void {
    this.composer.command('menu', this.onGetMenuHandler);

    this.router.route(ROUTE_MENU_TIP, this.mainMenuService.getFirstMenuTip);

    this.botKeyboardsService.initUserTypeKeyboard(
      this.botHandlersService.onUserTypeHandler,
      this.botHandlersService.onFinalUserTypeHandler,
      this.onOtherHandler,
    );

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
    this.landlordsKeyboardsService.initLandlordObjectFormKeyboard(
      this.mainMenuService.getMenu,
      this.landlordsHandlersService.onFillLandlordObjectFormHandler,
      this.landlordsHandlersService.onDeleteObjectHandler,
    );
    this.mainMenuKeyboardsService.initMainMenuKeyboard(
      this.onOtherHandler,
      this.onAboutHandler,
      this.onBackToMainMenuHandler,
      {
        onNextObject: this.onNextObjectHandler,
        onSendFilters: this.onFiltersHandler,
        onSendRenterInfo: this.onSendRenterInfo,
        onFindObject: this.rentersObjectsHandlersService.onFindObjectMenuButtonHandler,
      },
      {
        onLandlordObject: this.onLandlordObject,
        onLandlordObjectStopResume: this.landlordsHandlersService.onLandlordObjectStopResume,
      },
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
    const text = await this.mainMenuService.getMenuMainPageText(ctx);
    await ctx.editMessageText(text);
  };

  onOtherHandler: HandlerOnOther = async ctx => {
    const session = await ctx.session;
    const userType = session.type;
    if (userType === TelegramUserType.renter) {
      await ctx.editMessageText(this.mainMenuTextsService.getRenterSecondPageText());
      return;
    } else if (userType === TelegramUserType.landlord) {
      await ctx.editMessageText(this.mainMenuTextsService.getLandlordSecondPageText());
      return;
    }
  };

  onAboutHandler: HandlerOnAbout = async ctx => {
    const session = await ctx.session;
    const userType = session.type;
    if (ctx.msg?.text?.includes('Изменить статус')) {
      const aboutText = this.mainMenuTextsService.getAboutUsText(userType);
      await ctx.editMessageText(aboutText);
    }
  };

  onLandlordObject: HandlerOnLandlordObject = async ctx => {
    await this.landlordsService.sendLandlordObjectForm(ctx);
  };
}
