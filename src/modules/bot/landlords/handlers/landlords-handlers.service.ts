import { Injectable } from '@nestjs/common';
import { Router } from '@grammyjs/router';
import { Composer } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  LandlordObjectFormStep,
  TelegramUserType,
} from '../../session-storage/interfaces/session-storage.interface';
import {
  HandlerDeleteObject,
  HandlerLandlordObjectForm,
  HandlerLandlordOnFirstTip,
  HandlerObjectFormAddressQuestion,
  HandlerObjectFormCommentQuestion,
  HandlerObjectFormLocationQuestion,
  HandlerObjectFormNameQuestion,
  HandlerObjectFormObjectTypeQuestion,
  HandlerObjectFormPhoneNumberQuestion,
  HandlerObjectFormPhotosQuestion,
  HandlerObjectFormPriceQuestion,
  HandlerObjectFormRoomBedPreferredGenderQuestion,
  HandlerObjectFormRoomsNumberQuestion,
  HandlerObjectRenewCallback,
  HandlerOnLandlordObjectStopResume,
} from '../interfaces/landlords-handlers.interface';
import { LandlordsTextsService } from '../texts/landlords-texts.service';
import { LandlordsService } from '../landlords.service';
import { validatePhoneNumber } from '../../renters/handlers/helpers/phoneNumber.validate';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import {
  KEYBOARD_OBJECT_FORM_LOCATION_PREFIX,
  KEYBOARD_OBJECT_FORM_OBJECT_TYPE_PREFIX,
  KEYBOARD_OBJECT_FORM_PHOTOS_PREFIX,
  KEYBOARD_OBJECT_FORM_PREFERRED_GENDER_PREFIX,
  KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX,
  KEYBOARD_RENEW_OBJECT_PREFIX,
} from '../keyboards/landlords-keyboards.service';
import { PreferredGenderEnumType } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import { getDataFromCallbackQuery } from '../../helpers/getDataFromCallbackQuery';
import { MainMenuService } from '../../main-menu/main-menu.service';
import { LandlordsApiService } from '../api/landlords-api.service';
import { BotApiService } from '../../main/api/bot-api.service';
import { sendAnalyticsEvent } from '../../../../utils/google-analytics/sendAnalyticsEvent';
import {
  LANDLORD_ACTION,
  LANDLORD_HELLO_EVENT,
  LANDLORD_STOP_SEARCH,
} from '../../../../utils/google-analytics/events';
import { ReviewsService } from '../../reviews/reviews.service';
import { getPrice } from './helpers/price';

const ROUTE_FIRST_TIP = 'route-landlord-first-tip';

const ROUTE_OBJECT_FORM_NAME: LandlordObjectFormStep = 'name';
const ROUTE_OBJECT_FORM_PHONE_NUMBER: LandlordObjectFormStep = 'phoneNumber';
const ROUTE_OBJECT_FORM_OBJECT_TYPE: LandlordObjectFormStep = 'objectType';
const ROUTE_OBJECT_FORM_PRICE: LandlordObjectFormStep = 'price';
const ROUTE_OBJECT_FORM_LOCATION: LandlordObjectFormStep = 'location';
const ROUTE_OBJECT_FORM_ADDRESS: LandlordObjectFormStep = 'address';
const ROUTE_OBJECT_FORM_PHOTOS: LandlordObjectFormStep = 'photoIds';
const ROUTE_OBJECT_FORM_ROOMS_NUMBER: LandlordObjectFormStep = 'roomsNumber';
const ROUTE_OBJECT_FORM_PREFERRED_GENDER: LandlordObjectFormStep = 'preferredGender';
const ROUTE_OBJECT_FORM_COMMENT: LandlordObjectFormStep = 'comment';

@Injectable()
export class LandlordsHandlersService {
  composer: Composer<MyContext> = new Composer<MyContext>();

  public firstTipRouter: Router<MyContext> = new Router<MyContext>(async ctx => {
    const session = await ctx.session;
    const { type } = session;
    if (type !== TelegramUserType.landlord) {
      return undefined;
    }

    return !session.landlord.firstTip ? ROUTE_FIRST_TIP : undefined;
  });

  public objectFormRouter: Router<MyContext> = new Router<MyContext>(async ctx => {
    const session = await ctx.session;
    const {
      type,
      landlord: { objectStep },
    } = session;
    if (type !== TelegramUserType.landlord) {
      return undefined;
    }
    return objectStep;
  });

  constructor(
    private readonly landlordsService: LandlordsService,
    private readonly landlordsTextsService: LandlordsTextsService,
    private readonly landlordsApiService: LandlordsApiService,

    private readonly botApiService: BotApiService,

    private readonly mainMenuService: MainMenuService,

    private readonly reviewsService: ReviewsService,
  ) {
    this.firstTipRouter.route(ROUTE_FIRST_TIP, this.onShowFirstTipHandler);

    this.objectFormRouter.route(ROUTE_OBJECT_FORM_NAME, this.onObjectFormName);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_PHONE_NUMBER, this.onObjectFormPhoneNumber);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_OBJECT_TYPE, this.onObjectFormObjectType);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_PRICE, this.onObjectFormPrice);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_LOCATION, this.onObjectFormLocation);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_ADDRESS, this.onObjectFormAddress);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_PHOTOS, this.onObjectFormPhotos);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_ROOMS_NUMBER, this.onObjectFormRoomsNumber);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_PREFERRED_GENDER, this.onObjectFormPreferredGender);
    this.objectFormRouter.route(ROUTE_OBJECT_FORM_COMMENT, this.onObjectFormComment);

    this.composer.callbackQuery(new RegExp(`^${KEYBOARD_RENEW_OBJECT_PREFIX}`), this.onObjectRenewCallback);
  }

  public onFillLandlordObjectFormHandler: HandlerLandlordObjectForm = async ctx => {
    await this.landlordsService.sendObjectFormNameQuestion(ctx);
  };

  public onDeleteObjectHandler: HandlerDeleteObject = async ctx => {
    const chatId = ctx.from.id.toString();
    await this.landlordsApiService.deleteObject(chatId);
    await ctx.reply(this.landlordsTextsService.getDeletedText());
    setTimeout(() => void this.mainMenuService.getMenu(ctx), 3000);
  };

  public onLandlordObjectStopResume: HandlerOnLandlordObjectStopResume = async (isActive, ctx, _next) => {
    const chatId = ctx.from.id.toString();
    if (isActive) {
      await this.landlordsApiService.stopSearchObject(chatId);
    } else {
      await this.landlordsApiService.resumeSearchObject(chatId);
    }
    ctx.menu.update();
  };

  private onShowFirstTipHandler: HandlerLandlordOnFirstTip = async (ctx, _next) => {
    const landlordSession = (await ctx.session).landlord;
    landlordSession.firstTip = true;

    const usersCount = await this.botApiService.getUsersCount();
    const text = this.landlordsTextsService.getFirstTipTexts(usersCount);
    await ctx.reply(text[0]);
    await ctx.reply(text[1]);

    await new Promise(res => setTimeout(res, 5000));
    const onboardPhotoSrc =
      'https://s3.eu-central-1.amazonaws.com/telegram.sendpulse.prod/attachments/e97ea7c9281452db256460bbd2ea3af5/77868bf6-39be-4fc8-ac44-86fa580bc292.png';
    await ctx.replyWithPhoto(onboardPhotoSrc);

    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_HELLO_EVENT);
    await new Promise(res => setTimeout(res, 5000));

    await this.mainMenuService.getMenu(ctx);
  };

  private onObjectFormName: HandlerObjectFormNameQuestion = async ctx => {
    const name = ctx.message?.text;
    if (!name) {
      await this.landlordsService.sendObjectFormNameQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.name = name;
    session.landlord.objectStepsData = objectData;

    await this.landlordsService.sendObjectFormPhoneNumberQuestion(ctx);
  };

  private onObjectFormPhoneNumber: HandlerObjectFormPhoneNumberQuestion = async ctx => {
    const phoneNumber = ctx.msg?.contact?.phone_number ?? ctx.msg?.text;
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      await this.landlordsService.sendObjectFormPhoneNumberQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.phoneNumber = phoneNumber;
    session.landlord.objectStepsData = objectData;

    await this.landlordsService.sendObjectFormObjectTypeQuestion(ctx);
  };

  private onObjectFormObjectType: HandlerObjectFormObjectTypeQuestion = async ctx => {
    const objectType = getDataFromCallbackQuery<ObjectTypeEnum>(
      KEYBOARD_OBJECT_FORM_OBJECT_TYPE_PREFIX,
      ctx.callbackQuery?.data,
    );
    if (!objectType) {
      await this.landlordsService.sendObjectFormObjectTypeQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.objectType = objectType;
    session.landlord.objectStepsData = objectData;

    await this.landlordsService.sendObjectFormPriceQuestion(ctx);
    await ctx.answerCallbackQuery();
  };

  private onObjectFormPrice: HandlerObjectFormPriceQuestion = async ctx => {
    const price = getPrice(ctx.message?.text);
    if (!price) {
      await this.landlordsService.sendObjectFormPriceQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.price = price.trim();
    session.landlord.objectStepsData = objectData;

    await this.landlordsService.sendObjectFormLocationQuestion(ctx);
  };

  private onObjectFormLocation: HandlerObjectFormLocationQuestion = async ctx => {
    const location = getDataFromCallbackQuery<LocationsEnum>(
      KEYBOARD_OBJECT_FORM_LOCATION_PREFIX,
      ctx.callbackQuery?.data,
    );
    if (!location) {
      await this.landlordsService.sendObjectFormLocationQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.location = location;
    session.landlord.objectStepsData = objectData;

    await this.landlordsService.sendObjectFormAddressQuestion(ctx);
    await ctx.answerCallbackQuery();
  };

  private onObjectFormAddress: HandlerObjectFormAddressQuestion = async ctx => {
    const address = ctx.message?.text;
    if (!address) {
      await this.landlordsService.sendObjectFormAddressQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.address = address;
    session.landlord.objectStepsData = objectData;

    await this.landlordsService.sendObjectFormPhotosQuestion(ctx);
  };

  private onObjectFormPhotos: HandlerObjectFormPhotosQuestion = async ctx => {
    const uploadedPhotoSizes = ctx.message?.photo;
    const callbackData = getDataFromCallbackQuery<'submit' | 'delete'>(
      KEYBOARD_OBJECT_FORM_PHOTOS_PREFIX,
      ctx.callbackQuery?.data,
    );

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.photoIds = objectData.photoIds ?? [];

    const noData = !uploadedPhotoSizes && !callbackData;
    const limitExceeded = uploadedPhotoSizes && objectData.photoIds.length === 10;
    if (noData || limitExceeded) {
      await this.landlordsService.sendObjectFormPhotosQuestion(ctx);
      return;
    }

    if (uploadedPhotoSizes) {
      objectData.photoIds.push(uploadedPhotoSizes[uploadedPhotoSizes.length - 1].file_id);
      session.landlord.objectStepsData = objectData;

      await this.landlordsService.sendObjectFormPhotosQuestion(ctx);
      return;
    }
    if (callbackData === 'submit') {
      await this.landlordsService.sendObjectFormRoomsNumberQuestion(ctx);
      return;
    }
    if (callbackData === 'delete') {
      objectData.photoIds = objectData.photoIds.splice(0, objectData.photoIds.length - 1);
      session.landlord.objectStepsData = objectData;

      await this.landlordsService.sendObjectFormPhotosQuestion(ctx);
      return;
    }
    await ctx.answerCallbackQuery();
  };

  private onObjectFormRoomsNumber: HandlerObjectFormRoomsNumberQuestion = async ctx => {
    const callbackData = getDataFromCallbackQuery<string>(
      KEYBOARD_OBJECT_FORM_ROOMS_NUMBER_PREFIX,
      ctx.callbackQuery?.data,
    );
    if (!callbackData) {
      await this.landlordsService.sendObjectFormRoomsNumberQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.roomsNumber = callbackData;

    if (objectData.objectType === ObjectTypeEnum.apartments) {
      await this.landlordsService.sendObjectFormCommentQuestion(ctx);
    } else {
      await this.landlordsService.sendObjectFormRoomBedPreferredGenderQuestion(ctx);
    }
    await ctx.answerCallbackQuery();
  };

  private onObjectFormPreferredGender: HandlerObjectFormRoomBedPreferredGenderQuestion = async ctx => {
    const callbackData = getDataFromCallbackQuery<PreferredGenderEnumType>(
      KEYBOARD_OBJECT_FORM_PREFERRED_GENDER_PREFIX,
      ctx.callbackQuery?.data,
    );
    if (!callbackData) {
      await this.landlordsService.sendObjectFormRoomBedPreferredGenderQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.preferredGender = callbackData;

    await this.landlordsService.sendObjectFormCommentQuestion(ctx);
    await ctx.answerCallbackQuery();
  };

  private onObjectFormComment: HandlerObjectFormCommentQuestion = async ctx => {
    const comment = ctx.message?.text;
    if (!comment) {
      await this.landlordsService.sendObjectFormCommentQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const objectData = session.landlord.objectStepsData ?? {};
    objectData.comment = comment;

    await this.landlordsService.submitObjectForm(ctx);
  };

  private onObjectRenewCallback: HandlerObjectRenewCallback = async ctx => {
    const actionWithObjectId = getDataFromCallbackQuery<string>(
      KEYBOARD_RENEW_OBJECT_PREFIX,
      ctx.callbackQuery.data,
    ) as string;
    const action = actionWithObjectId.split('_')[0] as 'renew' | 'stop';
    // const objectId = actionWithObjectId.split('_')[1];
    const chatId = ctx.from.id.toString();

    if (action === 'renew') {
      await this.landlordsApiService.renewObject(chatId);
      await ctx.editMessageText(this.landlordsTextsService.getRenewedText());
    } else if (action === 'stop') {
      await this.landlordsApiService.stopSearchObject(chatId);
      await ctx.editMessageText(this.landlordsTextsService.getStoppedText());

      sendAnalyticsEvent(chatId, LANDLORD_ACTION, LANDLORD_STOP_SEARCH);

      setTimeout(() => {
        this.reviewsService.sendReviewReason(ctx);
      }, 600);
    }
  };
}
