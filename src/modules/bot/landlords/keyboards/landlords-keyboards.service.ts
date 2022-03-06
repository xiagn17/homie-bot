import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { ReplyKeyboardMarkup } from '@grammyjs/types';
import { InlineKeyboard, Keyboard } from 'grammy';
import { GetMainMenu } from '../../main-menu/interfaces/main-menu.interface';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  EMOJI_APARTMENTS,
  EMOJI_BACK,
  EMOJI_BEDS,
  EMOJI_CHECK,
  EMOJI_COMMENT,
  EMOJI_CUT,
  EMOJI_FORBIDDEN,
  EMOJI_GENDER,
  EMOJI_GENDER_MAN,
  EMOJI_GENDER_WOMAN,
  EMOJI_NEXT,
  EMOJI_NOT_AGREE,
  EMOJI_OK,
  EMOJI_ROOMS,
} from '../../constants/emoji';
import { LandlordsApiService } from '../api/landlords-api.service';
import { HandlerLandlordObjectForm } from '../interfaces/landlords-handlers.interface';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import { PreferredGenderEnumType } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import {
  KEYBOARD_OBJECT_FORM_DETAILS_PREFIX,
  objectDetailsKeyboardData,
} from './helpers/objectDetailsKeyboard';

export const KEYBOARD_OBJECT_FORM_OBJECT_TYPE_PREFIX = 'object_form_object_type_';
export const KEYBOARD_OBJECT_FORM_LOCATION_PREFIX = 'object_form_location_';
export const KEYBOARD_OBJECT_FORM_PHOTOS_PREFIX = 'object_form_photos_';
export const KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX = 'object_form_rooms_number_';
export const KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX = 'object_form_people_number_';
export const KEYBOARD_OBJECT_FORM_PREFERRED_GENDER_PREFIX = 'object_form_preferred_gender_';
export const KEYBOARD_OBJECT_FORM_PLACE_ON_SITES_PREFIX = 'object_form_place_on_sites_';

export const KEYBOARD_RENEW_OBJECT_PREFIX = 'kb_renewObject_';

@Injectable()
export class LandlordsKeyboardsService {
  public landlordObjectFormKeyboard: Menu<MyContext>;

  constructor(private readonly landlordsApiService: LandlordsApiService) {}

  initLandlordObjectFormKeyboard(
    onBackToMainMenu: GetMainMenu,
    onFillObject: HandlerLandlordObjectForm,
  ): void {
    this.landlordObjectFormKeyboard = new Menu<MyContext>('keyboard-landlordObjectForm')
      .dynamic(async (mainCtx, range) => {
        const chatId = mainCtx.from?.id.toString() as string;
        const object = await this.landlordsApiService.getObject(chatId);
        const hasObject = !!object;
        const isApproved = object?.isApproved;

        if (!hasObject) {
          range.text(`${EMOJI_COMMENT} Заполнить`, onFillObject);
          return;
        }
        if (hasObject && !isApproved) {
          return;
        }
        // range.text('update object');
      })
      .row()
      .text(`${EMOJI_BACK} Меню`, onBackToMainMenu);
  }

  getPhoneNumberKeyboard(): ReplyKeyboardMarkup {
    return {
      keyboard: new Keyboard().requestContact('Поделиться номером').build(),
      resize_keyboard: true,
      one_time_keyboard: true,
    };
  }

  getLandlordObjectFormObjectTypeKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
      .text(
        `${EMOJI_APARTMENTS} Квартира`,
        `${KEYBOARD_OBJECT_FORM_OBJECT_TYPE_PREFIX}${ObjectTypeEnum.apartments}`,
      )
      .text(`${EMOJI_ROOMS} Комната`, `${KEYBOARD_OBJECT_FORM_OBJECT_TYPE_PREFIX}${ObjectTypeEnum.room}`)
      .text(`${EMOJI_BEDS} Койко-место`, `${KEYBOARD_OBJECT_FORM_OBJECT_TYPE_PREFIX}${ObjectTypeEnum.bed}`);
  }

  getLandlordObjectFormLocationKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
      .text(LocationsEnum.center, `${KEYBOARD_OBJECT_FORM_LOCATION_PREFIX}${LocationsEnum.center}`)
      .row()
      .text(LocationsEnum.north, `${KEYBOARD_OBJECT_FORM_LOCATION_PREFIX}${LocationsEnum.north}`)
      .text(LocationsEnum.south, `${KEYBOARD_OBJECT_FORM_LOCATION_PREFIX}${LocationsEnum.south}`)
      .row()
      .text(LocationsEnum.west, `${KEYBOARD_OBJECT_FORM_LOCATION_PREFIX}${LocationsEnum.west}`)
      .text(LocationsEnum.east, `${KEYBOARD_OBJECT_FORM_LOCATION_PREFIX}${LocationsEnum.east}`);
  }

  getLandlordObjectFormPhotosKeyboard(photosLength?: number): InlineKeyboard | undefined {
    if (!photosLength) {
      return undefined;
    }
    return new InlineKeyboard()
      .text(`${EMOJI_CHECK} Готово`, `${KEYBOARD_OBJECT_FORM_PHOTOS_PREFIX}submit`)
      .row()
      .text(`${EMOJI_CUT} Удалить послед. фото`, `${KEYBOARD_OBJECT_FORM_PHOTOS_PREFIX}delete`);
  }

  async getLandlordObjectFormDetailsKeyboard(ctx: MyContext): Promise<InlineKeyboard> {
    const { data, texts } = await objectDetailsKeyboardData(ctx);
    return new InlineKeyboard()
      .text(texts.couples, data.couples)
      .text(texts.animals, data.animals)
      .row()
      .text(texts.kids, data.kids)
      .text(texts.fridge, data.fridge)
      .row()
      .text(texts.washer, data.washer)
      .text(texts.dishWasher, data.dishWasher)
      .row()
      .text(texts.conditioner, data.conditioner)
      .text(texts.internet, data.internet)
      .row()
      .text(`${EMOJI_NEXT} Далее`, `${KEYBOARD_OBJECT_FORM_DETAILS_PREFIX}submit`);
  }

  getLandlordObjectFormRoomsNumberKeyboard(objectType: ObjectTypeEnum): InlineKeyboard {
    if (objectType === ObjectTypeEnum.apartments) {
      return new InlineKeyboard()
        .text(`Студия`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}Студия`)
        .text(`1`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}1`)
        .text(`2`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}2`)
        .row()
        .text(`3`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}3`)
        .text(`4`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}4`)
        .text(`4+`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}4+`);
    }
    return new InlineKeyboard()
      .text(`1`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}1`)
      .text(`2`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}2`)
      .row()
      .text(`3`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}3`)
      .text(`4+`, `${KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX}4+`);
  }

  getLandlordObjectFormRoomBedPeopleNumberKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
      .text(`1`, `${KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX}1`)
      .text(`2`, `${KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX}2`)
      .text(`3`, `${KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX}3`)
      .row()
      .text(`4`, `${KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX}4`)
      .text(`5`, `${KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX}5`)
      .text(`5+`, `${KEYBOARD_OBJECT_FORM_ROOM_BED_PEOPLE_NUMBER_PREFIX}5+`);
  }

  getLandlordObjectFormPreferredGenderKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
      .text(
        `${EMOJI_GENDER} Без разницы`,
        `${KEYBOARD_OBJECT_FORM_PREFERRED_GENDER_PREFIX}${PreferredGenderEnumType.NO_DIFFERENCE}`,
      )
      .row()
      .text(
        `${EMOJI_GENDER_MAN} Мужчину`,
        `${KEYBOARD_OBJECT_FORM_PREFERRED_GENDER_PREFIX}${PreferredGenderEnumType.MALE}`,
      )
      .text(
        `${EMOJI_GENDER_WOMAN} Женщину`,
        `${KEYBOARD_OBJECT_FORM_PREFERRED_GENDER_PREFIX}${PreferredGenderEnumType.FEMALE}`,
      );
  }

  async getLandlordObjectFormPlaceOnSitesKeyboard(ctx: MyContext): Promise<InlineKeyboard> {
    const session = await ctx.session;
    const placeOnSites = !!session.landlord.objectStepsData.placeOnSites;
    const text = placeOnSites
      ? `${EMOJI_CHECK} Согласен / Не согласен`
      : `Согласен / ${EMOJI_NOT_AGREE} Не согласен`;
    return new InlineKeyboard()
      .text(text, `${KEYBOARD_OBJECT_FORM_PLACE_ON_SITES_PREFIX}change`)
      .row()
      .text(`Подтвердить`, `${KEYBOARD_OBJECT_FORM_PLACE_ON_SITES_PREFIX}submit`);
  }

  getObjectRenewKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard()
      .text(`${EMOJI_OK} Актуально`, `${KEYBOARD_RENEW_OBJECT_PREFIX}renew_${objectId}`)
      .row()
      .text(`${EMOJI_FORBIDDEN} Остановить поиск`, `${KEYBOARD_RENEW_OBJECT_PREFIX}stop_${objectId}`);
  }
}
