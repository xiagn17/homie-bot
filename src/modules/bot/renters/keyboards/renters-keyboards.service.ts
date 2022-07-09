import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { InlineKeyboard, Keyboard } from 'grammy';
import { ReplyKeyboardMarkup } from '@grammyjs/types';
import { MyContext } from '../../main/interfaces/bot.interface';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';
import {
  SendFiltersLocationQuestion,
  SendFiltersPriceQuestion,
  SendUpdateAbout,
  SendUpdateLifestyle,
  SendUpdateName,
  SendUpdatePhoto,
  SendUpdateProfession,
  SendUpdateSocials,
} from '../interfaces/renters.interface';
import {
  HandlerOnBackToMainMenu,
  HandlerOnFilters,
} from '../../main-menu/interfaces/main-menu-handlers.interface';
import { RentersApiService } from '../api/renters-api.service';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import {
  HandlerOnFiltersLocation,
  HandlerOnFiltersObjectTypes,
  HandlerOnGender,
} from '../interfaces/renter-handlers.interface';
import { HandlerOnFillInfo } from '../interfaces/handler-on-fill-info.interface';
import {
  EMOJI_APARTMENTS,
  EMOJI_BACK,
  EMOJI_BEDS,
  EMOJI_CAT,
  EMOJI_CHECK,
  EMOJI_COMMENT,
  EMOJI_GENDER_MAN,
  EMOJI_GENDER_WOMAN,
  EMOJI_GLOBUS,
  EMOJI_HI,
  EMOJI_HOUSE_TYPE,
  EMOJI_LOCATION,
  EMOJI_MONEY,
  EMOJI_NEXT,
  EMOJI_PHOTOS,
  EMOJI_PROFESSION,
  EMOJI_ROOMS,
  EMOJI_SUPER,
} from '../../constants/emoji';
import { GetMainMenu } from '../../main-menu/interfaces/main-menu.interface';

export const KEYBOARD_RENTER_ONBOARDING_PREFIX = 'renter_onboarding_good';

@Injectable()
export class RentersKeyboardsService {
  public genderKeyboard: Menu<MyContext>;

  public filtersKeyboard: Menu<MyContext>;

  public renterInfoKeyboard: Menu<MyContext>;

  constructor(private readonly rentersApiService: RentersApiService) {}

  initGender(handler: HandlerOnGender): void {
    this.genderKeyboard = new Menu<MyContext>('keyboard-chooseGender')
      .text(`${EMOJI_GENDER_MAN} Мужчина`, async (ctx, next) => {
        await handler(GenderEnumType.MALE, ctx, next);
      })
      .text(`${EMOJI_GENDER_WOMAN} Женщина`, async (ctx, next) => {
        await handler(GenderEnumType.FEMALE, ctx, next);
      })
      .row();
  }

  getPhoneNumberKeyboard(): ReplyKeyboardMarkup {
    return {
      keyboard: new Keyboard().requestContact('Поделиться номером').build(),
      resize_keyboard: true,
      one_time_keyboard: true,
    };
  }

  async getRenterInfoLifestyleKeyboard(mainCtx: MyContext): Promise<InlineKeyboard> {
    const session = await mainCtx.session;
    const textDogCat = session.renter.infoStepsData?.lifestyle?.dogCat
      ? `${EMOJI_CHECK} Кошка/Собака`
      : 'Кошка/Собака';
    const textSmallAnimals = session.renter.infoStepsData?.lifestyle?.smallAnimals
      ? `${EMOJI_CHECK} С мал. животными`
      : 'С мал. животными';
    const textKids = session.renter.infoStepsData?.lifestyle?.kids ? `${EMOJI_CHECK} С детьми` : 'С детьми';
    const textDontDrink = session.renter.infoStepsData?.lifestyle?.dontDrink
      ? `${EMOJI_CHECK} Не приемлю алкоголь`
      : 'Не приемлю алкоголь';
    const textDontSmoke = session.renter.infoStepsData?.lifestyle?.dontSmoke
      ? `${EMOJI_CHECK} Не курю`
      : 'Не курю';
    const textWorkRemotely = session.renter.infoStepsData?.lifestyle?.workRemotely
      ? `${EMOJI_CHECK} Работаю удаленно`
      : 'Работаю удаленно';

    const nextData = session.renter.infoStepUpdate ? 'update' : 'create';
    return new InlineKeyboard()
      .text(textDogCat, `renterInfo_lifestyle_dogCat`)
      .text(textSmallAnimals, `renterInfo_lifestyle_smallAnimals`)
      .row()
      .text(textKids, `renterInfo_lifestyle_kids`)
      .text(textDontDrink, `renterInfo_lifestyle_dontDrink`)
      .row()
      .text(textDontSmoke, `renterInfo_lifestyle_dontSmoke`)
      .text(textWorkRemotely, `renterInfo_lifestyle_workRemotely`)
      .row()
      .text(`${EMOJI_NEXT} Далее`, `renterInfo_lifestyle_${nextData}`);
  }

  getRenterInfoPhotosKeyboard(): InlineKeyboard {
    return new InlineKeyboard().text(`${EMOJI_CHECK} Готово`, `renterInfo_photos_submit`);
  }

  getRenterOnboardingKeyboard(): InlineKeyboard {
    return new InlineKeyboard().text(`${EMOJI_SUPER} Все понятно`, KEYBOARD_RENTER_ONBOARDING_PREFIX);
  }

  initFiltersKeyboard(
    onBackToMainMenu: HandlerOnBackToMainMenu,
    onFiltersObjectTypes: HandlerOnFiltersObjectTypes,
    onSendFiltersPriceQuestion: SendFiltersPriceQuestion,
    onSendFiltersLocationQuestion: SendFiltersLocationQuestion,
    onFiltersLocation: HandlerOnFiltersLocation,
    onFilters: HandlerOnFilters,
  ): void {
    this.filtersKeyboard = new Menu<MyContext>('keyboard-filters')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .submenu(`${EMOJI_HOUSE_TYPE} Тип жилья`, 'keyboard-objectTypes', () => {})
      .text(`${EMOJI_MONEY} Бюджет`, onSendFiltersPriceQuestion)
      .submenu(`${EMOJI_LOCATION} Локация`, 'keyboard-filtersLocation', onSendFiltersLocationQuestion)
      .row()
      .back(`${EMOJI_BACK} Меню`, onBackToMainMenu);

    const objectTypesKeyboard = new Menu<MyContext>('keyboard-objectTypes').dynamic(
      async (mainCtx, range) => {
        const chatId = mainCtx.from?.id.toString() as string;
        const filters = await this.rentersApiService.getFilters(chatId);

        const textApartments = filters.objectType?.filter(t => t === ObjectTypeEnum.apartments)[0]
          ? `${EMOJI_CHECK} Квартиры`
          : `${EMOJI_APARTMENTS} Квартиры`;
        const textRooms = filters.objectType?.filter(t => t === ObjectTypeEnum.room)[0]
          ? `${EMOJI_CHECK} Комнаты`
          : `${EMOJI_ROOMS} Комнаты`;
        const textBeds = filters.objectType?.filter(t => t === ObjectTypeEnum.bed)[0]
          ? `${EMOJI_CHECK} Койко-места`
          : `${EMOJI_BEDS} Койко-места`;

        range
          .text(textApartments, onFiltersObjectTypes.bind(this, ObjectTypeEnum.apartments))
          .text(textRooms, onFiltersObjectTypes.bind(this, ObjectTypeEnum.room))
          .text(textBeds, onFiltersObjectTypes.bind(this, ObjectTypeEnum.bed))
          .row()
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .back(`Подтвердить`, () => {});
      },
    );

    const locationsKeyboard = new Menu<MyContext>('keyboard-filtersLocation').dynamic(
      async (mainCtx, range) => {
        const chatId = mainCtx.from?.id.toString() as string;
        const filters = await this.rentersApiService.getFilters(chatId);

        const textCenter = filters.locations?.filter(t => t === LocationsEnum.center)[0]
          ? `${EMOJI_CHECK} Центр`
          : `Центр`;
        const textWest = filters.locations?.filter(t => t === LocationsEnum.west)[0]
          ? `${EMOJI_CHECK} Запад`
          : `Запад`;
        const textEast = filters.locations?.filter(t => t === LocationsEnum.east)[0]
          ? `${EMOJI_CHECK} Восток`
          : `Восток`;
        const textNorth = filters.locations?.filter(t => t === LocationsEnum.north)[0]
          ? `${EMOJI_CHECK} Север`
          : `Север`;
        const textSouth = filters.locations?.filter(t => t === LocationsEnum.south)[0]
          ? `${EMOJI_CHECK} Юг`
          : `Юг`;

        range
          .text(textCenter, onFiltersLocation.bind(this, LocationsEnum.center))
          .row()
          .text(textNorth, onFiltersLocation.bind(this, LocationsEnum.north))
          .text(textSouth, onFiltersLocation.bind(this, LocationsEnum.south))
          .row()
          .text(textWest, onFiltersLocation.bind(this, LocationsEnum.west))
          .text(textEast, onFiltersLocation.bind(this, LocationsEnum.east))
          .row()
          .back(`Подтвердить`, onFilters);
      },
    );

    this.filtersKeyboard.register(objectTypesKeyboard);
    this.filtersKeyboard.register(locationsKeyboard);
  }

  initRenterInfoKeyboard(
    onFillInfo: HandlerOnFillInfo,
    onBackToMainMenu: GetMainMenu,
    onSendUpdateName: SendUpdateName,
    onSendUpdateSocials: SendUpdateSocials,
    onSendUpdateLifestyle: SendUpdateLifestyle,
    onSendUpdateProfession: SendUpdateProfession,
    onSendUpdateAbout: SendUpdateAbout,
    onSendUpdatePhotos: SendUpdatePhoto,
  ): void {
    this.renterInfoKeyboard = new Menu<MyContext>('keyboard-renterInfo')
      .dynamic(async (mainCtx, range) => {
        const chatId = mainCtx.from?.id.toString() as string;
        const isInfoExists = await this.rentersApiService.isInfoExists(chatId);
        if (!isInfoExists) {
          range.text(`${EMOJI_COMMENT} Заполнить`, async ctx => {
            await onFillInfo('menu', ctx);
          });
          return;
        }
        range
          .text(EMOJI_PHOTOS, onSendUpdatePhotos)
          .text(EMOJI_HI, onSendUpdateName)
          .text(EMOJI_GLOBUS, onSendUpdateSocials)
          .row()
          .text(EMOJI_CAT, onSendUpdateLifestyle)
          .text(EMOJI_PROFESSION, onSendUpdateProfession)
          .text(EMOJI_COMMENT, onSendUpdateAbout);
      })
      .row()
      .text(`${EMOJI_BACK} Меню`, onBackToMainMenu);
  }
}
