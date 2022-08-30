import { Injectable } from '@nestjs/common';
import { InputMediaPhoto } from 'grammy/out/platform.node';
import { OBJECT_DEFAULT_PHOTO } from '../constants/imageUrls';
import { ObjectTypeEnum } from '../../api/renters/entities/RenterFilters.entity';
import { sendAnalyticsEvent } from '../../../utils/google-analytics/sendAnalyticsEvent';
import {
  LANDLORD_ACTION,
  LANDLORD_FORM_DONE_EVENT,
  LANDLORD_FORM_Q10_KV_EVENT,
  LANDLORD_FORM_Q10_RM_EVENT,
  LANDLORD_FORM_Q12_KV_EVENT,
  LANDLORD_FORM_Q13_RM_EVENT,
  LANDLORD_FORM_Q14_RM_EVENT,
  LANDLORD_FORM_Q2_EVENT,
  LANDLORD_FORM_Q3_EVENT,
  LANDLORD_FORM_Q5_EVENT,
  LANDLORD_FORM_Q6_EVENT,
  LANDLORD_FORM_Q7_EVENT,
  LANDLORD_FORM_Q8_EVENT,
  LANDLORD_FORM_START_EVENT,
} from '../../../utils/google-analytics/events';
import { AdminKeyboardsService } from '../admin/keyboards/admin-keyboards.service';
import {
  SendLandlordObjectForm,
  SendObjectFormAddressQuestion,
  SendObjectFormCommentQuestion,
  SendObjectFormLocationQuestion,
  SendObjectFormNameQuestion,
  SendObjectFormObjectTypeQuestion,
  SendObjectFormPhoneNumberQuestion,
  SendObjectFormPhotosQuestion,
  SendObjectFormPriceQuestion,
  SendObjectFormRoomBedPreferredGenderQuestion,
  SendObjectFormRoomsNumberQuestion,
  SubmitObjectForm,
} from './interfaces/landlords.interface';
import { LandlordsKeyboardsService } from './keyboards/landlords-keyboards.service';
import { LandlordsApiService } from './api/landlords-api.service';
import { LandlordsTextsService } from './texts/landlords-texts.service';
import { getFormData } from './helpers/objectFormData';

@Injectable()
export class LandlordsService {
  constructor(
    private readonly landlordsKeyboardsService: LandlordsKeyboardsService,
    private readonly landlordsTextsService: LandlordsTextsService,
    private readonly landlordsApiService: LandlordsApiService,

    private readonly adminKeyboardsService: AdminKeyboardsService,
  ) {}

  public sendLandlordObjectForm: SendLandlordObjectForm = async ctx => {
    const chatId = ctx.from?.id.toString() as string;
    const object = await this.landlordsApiService.getObject(chatId);

    const text = object
      ? this.landlordsTextsService.getLandlordObjectFormText(object)
      : this.landlordsTextsService.getNoLandlordObjectFormText();
    const photos = object ? object.photoIds : [OBJECT_DEFAULT_PHOTO];
    const mediaGroup: InputMediaPhoto[] = photos.map(p => ({
      type: 'photo',
      media: p,
    }));
    const keyboard = this.landlordsKeyboardsService.landlordObjectFormKeyboard;

    await ctx.replyWithMediaGroup(mediaGroup);
    await ctx.reply(text, {
      reply_markup: keyboard,
    });
  };

  public sendObjectFormNameQuestion: SendObjectFormNameQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'name';
    session.landlord.objectStepsData = {};
    await ctx.reply(this.landlordsTextsService.getObjectFormNameText());
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_START_EVENT);
  };

  public sendObjectFormPhoneNumberQuestion: SendObjectFormPhoneNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'phoneNumber';
    await ctx.reply(this.landlordsTextsService.getObjectFormPhoneNumberText(), {
      reply_markup: this.landlordsKeyboardsService.getPhoneNumberKeyboard(),
    });
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q2_EVENT);
  };

  public sendObjectFormObjectTypeQuestion: SendObjectFormObjectTypeQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'objectType';
    await ctx.reply(this.landlordsTextsService.getObjectFormObjectTypeText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormObjectTypeKeyboard(),
    });
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q3_EVENT);
  };

  public sendObjectFormPriceQuestion: SendObjectFormPriceQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'price';
    await ctx.reply(this.landlordsTextsService.getObjectFormPriceText());
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q5_EVENT);
  };

  public sendObjectFormLocationQuestion: SendObjectFormLocationQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'location';
    await ctx.reply(this.landlordsTextsService.getObjectFormLocationText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormLocationKeyboard(),
    });
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q6_EVENT);
  };

  public sendObjectFormAddressQuestion: SendObjectFormAddressQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'address';
    await ctx.reply(this.landlordsTextsService.getObjectFormAddressText());
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q7_EVENT);
  };

  public sendObjectFormPhotosQuestion: SendObjectFormPhotosQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'photoIds';

    const photos = session.landlord.objectStepsData.photoIds;
    if (photos?.length) {
      const mediaGroup: InputMediaPhoto[] = photos.map(p => ({
        type: 'photo',
        media: p,
      }));
      await ctx.replyWithMediaGroup(mediaGroup);
    }
    await ctx.reply(this.landlordsTextsService.getObjectFormPhotosText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormPhotosKeyboard(photos?.length),
    });
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q8_EVENT);
  };

  public sendObjectFormRoomsNumberQuestion: SendObjectFormRoomsNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'roomsNumber';

    const objectType = session.landlord.objectStepsData.objectType as ObjectTypeEnum;
    await ctx.reply(this.landlordsTextsService.getObjectFormRoomsNumberText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormRoomsNumberKeyboard(objectType),
    });

    const analyticsEvent =
      objectType === ObjectTypeEnum.apartments ? LANDLORD_FORM_Q10_KV_EVENT : LANDLORD_FORM_Q10_RM_EVENT;
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, analyticsEvent);
  };

  public sendObjectFormRoomBedPreferredGenderQuestion: SendObjectFormRoomBedPreferredGenderQuestion =
    async ctx => {
      const session = await ctx.session;
      session.landlord.objectStep = 'preferredGender';

      await ctx.reply(this.landlordsTextsService.getObjectFormRoomBedPreferredGenderText(), {
        reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormPreferredGenderKeyboard(),
      });
      sendAnalyticsEvent(ctx, LANDLORD_ACTION, LANDLORD_FORM_Q13_RM_EVENT);
    };

  public sendObjectFormCommentQuestion: SendObjectFormCommentQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'comment';

    await ctx.reply(this.landlordsTextsService.getObjectFormCommentText());

    const objectType = session.landlord.objectStepsData.objectType as ObjectTypeEnum;
    const analyticsEvent =
      objectType === ObjectTypeEnum.apartments ? LANDLORD_FORM_Q12_KV_EVENT : LANDLORD_FORM_Q14_RM_EVENT;
    sendAnalyticsEvent(ctx, LANDLORD_ACTION, analyticsEvent);
  };

  public submitObjectForm: SubmitObjectForm = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = undefined;

    const chatId = ctx.from?.id.toString() as string;
    const data = getFormData(session.landlord.objectStepsData, chatId);
    if (!data) {
      await ctx.reply(
        'Упс, у нас потерялись данные, заполните анкету еще раз, пожалуйста или обратитесь в поддержку',
      );
      return;
    }

    try {
      const object = await this.landlordsApiService.createObject(data);
      session.landlord.objectStepsData = {};
      if (object.isAdmin) {
        await ctx.reply(`Айдишник обьекта - ${object.id}\n\n#home${object.number}`, {
          reply_markup: this.adminKeyboardsService.getAdminObjectStarredKeyboard(object.id),
        });
      } else {
        const text = this.landlordsTextsService.getObjectFormModerationText(object.number);
        await ctx.reply(text);
        sendAnalyticsEvent(chatId, LANDLORD_ACTION, LANDLORD_FORM_DONE_EVENT);
      }
    } catch (e) {
      await ctx.reply('Упс, при сохранении произошла ошибка, обратитесь в поддержку или попробуйте еще раз');
    }
  };
}
