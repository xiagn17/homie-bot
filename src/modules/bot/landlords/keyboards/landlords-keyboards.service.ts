import { Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import { ReplyKeyboardMarkup } from '@grammyjs/types';
import { InlineKeyboard, Keyboard } from 'grammy';
import { GetMainMenu } from '../../main-menu/interfaces/main-menu.interface';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  EMOJI_APARTMENTS,
  EMOJI_BACK,
  EMOJI_BAG,
  EMOJI_BEDS,
  EMOJI_CHECK,
  EMOJI_COMMENT,
  EMOJI_CUT,
  EMOJI_FORBIDDEN,
  EMOJI_GENDER,
  EMOJI_GENDER_MAN,
  EMOJI_GENDER_WOMAN,
  EMOJI_OK,
  EMOJI_ROOMS,
} from '../../constants/emoji';
import { LandlordsApiService } from '../api/landlords-api.service';
import { HandlerDeleteObject, HandlerLandlordObjectForm } from '../interfaces/landlords-handlers.interface';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import { PreferredGenderEnumType } from '../../../api/landlord-objects/entities/LandlordObject.entity';

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
    onDeleteObject: HandlerDeleteObject,
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
        range.submenu(`${EMOJI_BAG} Удалить объект`, 'keyboard-LLObjectDelete');
      })
      .row()
      .text(`${EMOJI_BACK} Меню`, onBackToMainMenu);

    const secondDeletionMenu = new Menu<MyContext>('keyboard-LLObjectDelete')
      .text('Подтверждаю удаление', onDeleteObject)
      .row()
      .back('Отменить');

    this.landlordObjectFormKeyboard.register(secondDeletionMenu);
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

  getObjectRenewKeyboard(objectId: string): InlineKeyboard {
    return new InlineKeyboard()
      .text(`${EMOJI_OK} Актуально`, `${KEYBOARD_RENEW_OBJECT_PREFIX}renew_${objectId}`)
      .row()
      .text(`${EMOJI_FORBIDDEN} Остановить поиск`, `${KEYBOARD_RENEW_OBJECT_PREFIX}stop_${objectId}`);
  }
}
