import { Injectable } from '@nestjs/common';
import { Middleware } from '@grammyjs/menu/out/deps.node';
import { MyContext } from '../interfaces/bot.interface';
import { BotHandlersService } from '../handlers/bot-handlers.service';
import { RentersHandlersService } from '../../renters/handlers/renters-handlers.service';
import { MainMenuHandlersService } from '../../main-menu/handlers/main-menu-handlers.service';
import { RentersObjectsHandlersService } from '../../renter-objects/handlers/renters-objects-handlers.service';
import { RentersKeyboardsService } from '../../renters/keyboards/renters-keyboards.service';
import { MainMenuKeyboardsService } from '../../main-menu/keyboards/main-menu-keyboards.service';
import { RentersObjectsKeyboardsService } from '../../renter-objects/keyboards/renters-objects-keyboards.service';
import { LandlordsHandlersService } from '../../landlords/handlers/landlords-handlers.service';
import { AdminHandlersService } from '../../admin/handlers/admin-handlers.service';
import { LandlordRentersHandlersService } from '../../landlord-renters/handlers/landlord-renters-handlers.service';
import { ReviewsHandlersService } from '../../reviews/handlers/reviews-handlers.service';

@Injectable()
export class BotMiddlewaresService {
  constructor(
    private readonly botHandlersService: BotHandlersService,

    private readonly adminHandlersService: AdminHandlersService,

    private readonly mainMenuHandlersService: MainMenuHandlersService,
    private readonly mainMenuKeyboardsService: MainMenuKeyboardsService,

    private readonly rentersHandlersService: RentersHandlersService,
    private readonly rentersKeyboardsService: RentersKeyboardsService,

    private readonly landlordsHandlersService: LandlordsHandlersService,

    private readonly rentersObjectsHandlersService: RentersObjectsHandlersService,
    private readonly rentersObjectsKeyboardsService: RentersObjectsKeyboardsService,

    private readonly landlordRentersHandlersService: LandlordRentersHandlersService,

    private readonly reviewsHandlersService: ReviewsHandlersService,
  ) {}

  get middlewares(): Middleware<MyContext>[] {
    return [
      this.botHandlersService.composer,
      this.botHandlersService.routerUserType,

      this.rentersKeyboardsService.genderKeyboard,
      this.rentersHandlersService.routerGender,

      this.mainMenuKeyboardsService.mainMenuKeyboard,
      this.mainMenuHandlersService.composer,
      this.mainMenuHandlersService.router,

      this.landlordsHandlersService.firstTipRouter,

      this.rentersHandlersService.routerFilters,
      this.rentersHandlersService.composer,

      this.landlordsHandlersService.objectFormRouter,
      this.landlordsHandlersService.composer,

      this.rentersObjectsKeyboardsService.paySubscriptionMenu,
      this.rentersObjectsHandlersService.composer,

      this.landlordRentersHandlersService.composer,

      this.adminHandlersService.composer,

      this.reviewsHandlersService.composer,
    ];
  }
}
