import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  HandlerOnAbout,
  HandlerOnBackToMainMenu,
  HandlerOnFilters,
  HandlerOnLandlordObject,
  HandlerOnNextObject,
  HandlerOnOther,
  HandlerOnRenterInfo,
} from '../interfaces/main-menu-handlers.interface';
import {
  EMOJI_BACK,
  EMOJI_CHECK,
  EMOJI_FILTER,
  EMOJI_HOUSE,
  EMOJI_ID,
  EMOJI_INFO,
  EMOJI_LOOPA,
  EMOJI_NEXT,
  EMOJI_NOT_AGREE,
  EMOJI_SHARE,
  EMOJI_STATUS,
  EMOJI_SUPPORT,
  EMOJI_WOMAN_HAND,
} from '../../constants/emoji';
import { MainMenuApiService } from '../api/main-menu-api.service';
import { BotKeyboardsService } from '../../main/keyboards/bot-keyboards.service';
import { LandlordsKeyboardsService } from '../../landlords/keyboards/landlords-keyboards.service';
import { RentersKeyboardsService } from '../../renters/keyboards/renters-keyboards.service';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { HandlerOnLandlordObjectStopResume } from '../../landlords/interfaces/landlords-handlers.interface';
import { HandlerOnFindObjectMenuButton } from '../../renter-objects/interfaces/renter-objects-handlers.interface';
import { getReferralLink } from '../../helpers/referralLink/getReferralLink';

@Injectable()
export class MainMenuKeyboardsService {
  public mainMenuKeyboard: Menu<MyContext>;

  constructor(
    private readonly mainMenuApiService: MainMenuApiService,

    private readonly botKeyboardsService: BotKeyboardsService,
    private readonly landlordsKeyboardsService: LandlordsKeyboardsService,
    private readonly rentersKeyboardsService: RentersKeyboardsService,
  ) {}

  initMainMenuKeyboard(
    onOther: HandlerOnOther,
    onAbout: HandlerOnAbout,
    onBackToMainMenu: HandlerOnBackToMainMenu,
    renterHandlers: {
      onNextObject: HandlerOnNextObject;
      onSendFilters: HandlerOnFilters;
      onSendRenterInfo: HandlerOnRenterInfo;
      onFindObject: HandlerOnFindObjectMenuButton;
    },
    landlordHandlers: {
      onLandlordObject: HandlerOnLandlordObject;
      onLandlordObjectStopResume: HandlerOnLandlordObjectStopResume;
    },
  ): void {
    const { onNextObject, onSendFilters, onSendRenterInfo, onFindObject } = renterHandlers;
    const { onLandlordObject, onLandlordObjectStopResume } = landlordHandlers;

    this.mainMenuKeyboard = new Menu<MyContext>('keyboard-mainMenu')
      .dynamic(async (mainCtx, range) => {
        const userType = (await mainCtx.session).type;
        if (!userType) {
          return;
        }
        if (userType === TelegramUserType.renter) {
          range
            .submenu(`${EMOJI_FILTER} Фильтр`, 'keyboard-filters', onSendFilters)
            .text(`${EMOJI_WOMAN_HAND} Анкета`, onSendRenterInfo)
            .row()
            .text(`${EMOJI_NEXT} Смотреть объявления`, onNextObject);
        }
        if (userType === TelegramUserType.landlord) {
          const chatId = mainCtx.from?.id.toString() as string;
          const object = await this.mainMenuApiService.getUserObject(chatId);
          const hasObject = !!object;
          const isApproved = !!object?.isApproved;

          const objectText = hasObject
            ? `${EMOJI_HOUSE} Мое объявление`
            : `${EMOJI_HOUSE} Разместить объявление`;
          range.text(objectText, onLandlordObject).row();

          if (hasObject && isApproved) {
            const isActive = !!object?.isActive;
            const text = isActive ? `${EMOJI_CHECK} Поиск активен` : `${EMOJI_NOT_AGREE} Поиск остановлен`;
            range.text(text, onLandlordObjectStopResume.bind(this, isActive));
            return;
          } else if (hasObject) {
            return;
          } else {
            range.text(`${EMOJI_ID} Добавить объявление по ID`);
          }
        }
      })
      .row()
      .url(`${EMOJI_SUPPORT} Поддержка`, 'https://t.me/homie_admin')
      .submenu(`${EMOJI_INFO} Прочее`, 'keyboard-mainMenuSecond', onOther);

    const secondMenuKeyboard = new Menu<MyContext>('keyboard-mainMenuSecond')
      .dynamic(async (mainCtx, range) => {
        const userType = (await mainCtx.session).type;
        if (!userType) {
          return;
        }

        if (userType === TelegramUserType.renter) {
          range.text(`${EMOJI_LOOPA} Поиск по ID`, onFindObject);
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        range.submenu(`${EMOJI_STATUS} Изменить статус`, 'keyboard-userType', () => {}).row();
        if (userType === TelegramUserType.renter) {
          const referralLink = getReferralLink(mainCtx.from?.id.toString() as string);
          range.url(`${EMOJI_SHARE} Поделиться Homie`, `https://t.me/share/url?url=${referralLink}`).row();
        }
      })
      .text(`${EMOJI_INFO} О нас`, onAbout)
      .back(`${EMOJI_BACK} Главное меню`, onBackToMainMenu);

    this.mainMenuKeyboard.register(secondMenuKeyboard);

    this.mainMenuKeyboard.register(this.rentersKeyboardsService.filtersKeyboard);
    this.mainMenuKeyboard.register(this.rentersKeyboardsService.renterInfoKeyboard);
    this.mainMenuKeyboard.register(this.landlordsKeyboardsService.landlordObjectFormKeyboard);

    secondMenuKeyboard.register(this.botKeyboardsService.userTypeKeyboard);
  }
}
