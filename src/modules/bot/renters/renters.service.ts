import { Injectable } from '@nestjs/common';
import { RenterObjectsService } from '../renter-objects/renter-objects.service';
import { RenterFilledInfoStepsData } from '../session-storage/interfaces/session-storage.interface';
import { RENTER_DEFAULT_PHOTO } from '../constants/imageUrls';
import { sendAnalyticsEvent } from '../../../utils/google-analytics/sendAnalyticsEvent';
import {
  RENTER_ACTION,
  RENTER_ANKETA_AUTO_FILL_EVENT,
  RENTER_ANKETA_DONE_EVENT,
  RENTER_ANKETA_Q2_EVENT,
  RENTER_ANKETA_Q3_EVENT,
  RENTER_ANKETA_Q4_EVENT,
  RENTER_ANKETA_Q5_EVENT,
  RENTER_ANKETA_Q6_EVENT,
  RENTER_ANKETA_Q7_EVENT,
  RENTER_ANKETA_Q8_EVENT,
  RENTER_ANKETA_START_EVENT,
} from '../../../utils/google-analytics/events';
import { ApiRenterInfoDraft } from '../../api/renters/interfaces/renter-info.interface';
import {
  SendAboutQuestion,
  SendBirthdayYearQuestion,
  SubmitRenterInfo,
  SendLifestyleQuestion,
  SendNameQuestion,
  SendPhoneNumberQuestion,
  SendProfessionQuestion,
  SendSocialsQuestion,
  GetFiltersText,
  UpdateFiltersObjectTypes,
  SendFiltersPriceQuestion,
  UpdateFiltersPriceRange,
  SendFilters,
  SendFiltersLocationQuestion,
  UpdateFiltersLocation,
  GetRenterInfoWithText,
  SendRenterInfo,
  SendUpdateName,
  UpdateRenterName,
  SendUpdateSocials,
  UpdateRenterSocials,
  SendUpdateLifestyle,
  UpdateRenterLifestyle,
  SendUpdateProfession,
  UpdateRenterProfession,
  SendUpdateAbout,
  UpdateRenterAbout,
  CreateRenterWithGender,
  SendPhotoQuestion,
  SendUpdatePhoto,
  UpdateRenterPhoto,
  AutoSubmitRenterInfo,
} from './interfaces/renters.interface';
import { RentersKeyboardsService } from './keyboards/renters-keyboards.service';
import { RentersApiService } from './api/renters-api.service';
import { RentersTextsService } from './texts/renters-texts.service';

@Injectable()
export class RentersService {
  constructor(
    private rentersKeyboardsService: RentersKeyboardsService,
    private rentersApiService: RentersApiService,
    private rentersTextsService: RentersTextsService,

    private renterObjectsService: RenterObjectsService,
  ) {}

  sendNameQuestion: SendNameQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'name';
    await ctx.reply(this.rentersTextsService.getNameQuestionText());
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_START_EVENT);
  };

  sendBirthdayYearQuestion: SendBirthdayYearQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'birthdayYear';
    await ctx.reply(this.rentersTextsService.getBirthdayYearQuestionText());
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q2_EVENT);
  };

  sendPhoneNumberQuestion: SendPhoneNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'phoneNumber';
    await ctx.reply(this.rentersTextsService.getPhoneNumberQuestionText(), {
      reply_markup: this.rentersKeyboardsService.getPhoneNumberKeyboard(),
    });
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q3_EVENT);
  };

  sendSocialsQuestion: SendSocialsQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'socials';
    await ctx.reply(this.rentersTextsService.getSocialsQuestionText(), {
      reply_markup: { remove_keyboard: true },
    });
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q4_EVENT);
  };

  sendLifestyleQuestion: SendLifestyleQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'lifestyle';
    await ctx.reply(this.rentersTextsService.getLifestyleQuestionText(), {
      reply_markup: await this.rentersKeyboardsService.getRenterInfoLifestyleKeyboard(ctx),
    });
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q5_EVENT);
  };

  sendProfessionQuestion: SendProfessionQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'profession';
    await ctx.reply(this.rentersTextsService.getProfessionQuestionText());
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q6_EVENT);
  };

  sendAboutQuestion: SendAboutQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'about';
    await ctx.reply(this.rentersTextsService.getAboutQuestionText());
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q7_EVENT);
  };

  sendPhotoQuestion: SendPhotoQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'photo';
    const photo = session.renter.infoStepsData.photo;

    const text = this.rentersTextsService.getPhotosQuestionText(!!photo);
    if (photo) {
      await ctx.replyWithPhoto(photo, {
        caption: text,
        reply_markup: this.rentersKeyboardsService.getRenterInfoPhotosKeyboard(),
      });
      return;
    }
    await ctx.reply(text);
    sendAnalyticsEvent(ctx, RENTER_ACTION, RENTER_ANKETA_Q8_EVENT);
  };

  sendUpdateName: SendUpdateName = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'name';
    session.renter.infoStepUpdate = true;
    await ctx.reply(this.rentersTextsService.getNameQuestionText());
  };

  updateRenterName: UpdateRenterName = async (name, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    await this.rentersApiService.updateRenterInfo({ name: name, chatId: chatId });
    await this.sendRenterInfoMessage(ctx);
  };

  sendUpdateSocials: SendUpdateSocials = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'socials';
    session.renter.infoStepUpdate = true;
    await ctx.reply(this.rentersTextsService.getSocialsQuestionText());
  };

  updateRenterSocials: UpdateRenterSocials = async (socials, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    await this.rentersApiService.updateRenterInfo({ socials: socials, chatId: chatId });
    await this.sendRenterInfoMessage(ctx);
  };

  sendUpdateLifestyle: SendUpdateLifestyle = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'lifestyle';
    session.renter.infoStepUpdate = true;
    await ctx.reply(this.rentersTextsService.getLifestyleQuestionText(), {
      reply_markup: await this.rentersKeyboardsService.getRenterInfoLifestyleKeyboard(ctx),
    });
  };

  updateRenterLifestyle: UpdateRenterLifestyle = async ctx => {
    const chatId = ctx.from?.id.toString() as string;
    const session = await ctx.session;
    const lifestyle = session.renter.infoStepsData.lifestyle;
    await this.rentersApiService.updateRenterInfo({ lifestyle: lifestyle, chatId: chatId });
    await this.sendRenterInfoMessage(ctx);
  };

  sendUpdateProfession: SendUpdateProfession = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'profession';
    session.renter.infoStepUpdate = true;
    await ctx.reply(this.rentersTextsService.getProfessionQuestionText());
  };

  updateRenterProfession: UpdateRenterProfession = async (profession, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    await this.rentersApiService.updateRenterInfo({ profession: profession, chatId: chatId });
    await this.sendRenterInfoMessage(ctx);
  };

  sendUpdateAbout: SendUpdateAbout = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'about';
    session.renter.infoStepUpdate = true;
    await ctx.reply(this.rentersTextsService.getAboutQuestionText());
  };

  sendUpdatePhoto: SendUpdatePhoto = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'photo';
    session.renter.infoStepUpdate = true;
    const photo = session.renter.infoStepsData.photo;

    const text = this.rentersTextsService.getPhotosQuestionText(!!photo);
    if (photo) {
      await ctx.replyWithPhoto(photo, {
        caption: text,
        reply_markup: this.rentersKeyboardsService.getRenterInfoPhotosKeyboard(),
      });
      return;
    }
    await ctx.reply(text);
  };

  updateRenterAbout: UpdateRenterAbout = async (about, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    await this.rentersApiService.updateRenterInfo({ about: about, chatId: chatId });
    await this.sendRenterInfoMessage(ctx);
  };

  updateRenterPhoto: UpdateRenterPhoto = async (photo, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    await this.rentersApiService.updateRenterInfo({ photo: photo, chatId: chatId });
    await this.sendRenterInfoMessage(ctx);
  };

  submitRenterInfo: SubmitRenterInfo = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = undefined;
    if (
      !(
        session.renter.infoStepsData.name &&
        session.renter.infoStepsData.birthdayYear &&
        session.renter.infoStepsData.about &&
        session.renter.infoStepsData.lifestyle &&
        session.renter.infoStepsData.socials &&
        session.renter.infoStepsData.phoneNumber &&
        session.renter.infoStepsData.profession &&
        session.renter.infoStepsData.photo
      )
    ) {
      await ctx.reply('Упс, у нас потерялись данные, заполните анкету еще раз, пожалуйста');
      session.renter.infoFillFrom = 'menu';
      session.renter.infoStepsData = {};
      await this.sendNameQuestion(ctx);
      return;
    }

    const chatId = ctx.from?.id.toString() as string;
    sendAnalyticsEvent(chatId, RENTER_ACTION, RENTER_ANKETA_DONE_EVENT);
    const infoData = session.renter.infoStepsData as RenterFilledInfoStepsData;

    try {
      await this.rentersApiService.createInfo({
        ...infoData,
        zodiacSign: null,
        chatId: chatId,
      });
    } catch (e) {
      await ctx.reply('Упс, при сохранении произошла ошибка, напишите в поддержку');
      session.renter.infoStep = undefined;
      return;
    }

    const infoFillFrom =
      session.renter.infoFillFrom === 'menu' ? 'menu' : session.renter.infoFillFrom?.split('_')[0];
    if (infoFillFrom === 'object') {
      const objectId = session.renter.infoFillFrom?.split('_')[1] as string;

      await ctx.reply(this.rentersTextsService.getSuccessfulFilledInfoAfterObjectRequestText());
      setTimeout(() => void this.renterObjectsService.sendObjectRequest(objectId, true, ctx), 1000);
    } else if (infoFillFrom === 'menu') {
      await this.sendRenterInfoMessage(ctx);
    }
  };

  autoSubmitRenterInfo: AutoSubmitRenterInfo = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = undefined;

    const chatId = ctx.from?.id.toString() as string;
    const infoData: ApiRenterInfoDraft = {
      name: '-',
      birthdayYear: 2000,
      phoneNumber: '-',
      socials: '-',
      lifestyle: {
        dogCat: false,
        smallAnimals: false,
        dontSmoke: false,
        dontDrink: false,
        kids: false,
        workRemotely: false,
      },
      profession: '-',
      about: '-',
      photo: RENTER_DEFAULT_PHOTO,
      zodiacSign: null,
      chatId: chatId,
    };

    try {
      await this.rentersApiService.createInfo(infoData);
      sendAnalyticsEvent(chatId, RENTER_ACTION, RENTER_ANKETA_AUTO_FILL_EVENT);
    } catch (e) {
      await ctx.reply('Упс, при сохранении произошла ошибка, напишите в поддержку');
      session.renter.infoStep = undefined;
      return;
    }

    const infoFillFrom =
      session.renter.infoFillFrom === 'menu' ? 'menu' : session.renter.infoFillFrom?.split('_')[0];
    if (infoFillFrom === 'object') {
      const objectId = session.renter.infoFillFrom?.split('_')[1] as string;

      await ctx.reply(this.rentersTextsService.getSuccessfulFilledInfoAfterObjectRequestText());
      setTimeout(() => void this.renterObjectsService.sendObjectRequest(objectId, true, ctx), 1000);
    } else if (infoFillFrom === 'menu') {
      await ctx.reply(this.rentersTextsService.getSuccessfulAutoFilledInfo());
      setTimeout(() => void this.sendRenterInfoMessage(ctx), 1000);
    }
  };

  getFiltersText: GetFiltersText = async ctx => {
    const chatId = ctx.from?.id.toString() as string;
    const filters = await this.rentersApiService.getFilters(chatId);
    return this.rentersTextsService.getFiltersText(filters);
  };

  sendFiltersMessage: SendFilters = async ctx => {
    const text = await this.getFiltersText(ctx);
    await ctx.reply(text, { reply_markup: this.rentersKeyboardsService.filtersKeyboard });
  };

  updateFiltersObjectTypes: UpdateFiltersObjectTypes = async (objectType, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    const filtersObjectTypes = (await this.rentersApiService.getFilters(chatId)).objectType ?? [];
    const hasInObjectTypes = !!filtersObjectTypes.filter(t => t === objectType)[0];
    const newObjectTypes = hasInObjectTypes
      ? filtersObjectTypes.filter(t => t !== objectType)
      : filtersObjectTypes.concat(objectType);

    await this.rentersApiService.updateFilters({ chatId, objectType: newObjectTypes });
  };

  updateFiltersLocation: UpdateFiltersLocation = async (location, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    const filtersLocations = (await this.rentersApiService.getFilters(chatId)).locations ?? [];
    const hasInLocations = !!filtersLocations.filter(t => t === location)[0];
    const newLocations = hasInLocations
      ? filtersLocations.filter(t => t !== location)
      : filtersLocations.concat(location);

    await this.rentersApiService.updateFilters({ chatId, locations: newLocations });
  };

  sendFiltersPriceQuestion: SendFiltersPriceQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.filterStep = 'priceRange';
    await ctx.reply(this.rentersTextsService.getFiltersPriceQuestionText());
  };

  sendFiltersLocationQuestion: SendFiltersLocationQuestion = async ctx => {
    await ctx.editMessageText(this.rentersTextsService.getFiltersLocationQuestionText(), {
      disable_web_page_preview: false,
    });
  };

  updateFiltersPriceRange: UpdateFiltersPriceRange = async (priceRangeStart, priceRangeEnd, ctx) => {
    const chatId = ctx.from?.id.toString() as string;
    await this.rentersApiService.updateFilters({
      chatId,
      priceRangeStart: priceRangeStart * 1000,
      priceRangeEnd: priceRangeEnd * 1000,
    });

    await this.sendFiltersMessage(ctx);
  };

  getRenterInfoWithText: GetRenterInfoWithText = async ctx => {
    const chatId = ctx.from?.id.toString() as string;
    const renterInfo = await this.rentersApiService.getRenterInfo(chatId);
    return {
      text: this.rentersTextsService.getRenterInfoText(renterInfo),
      exists: !!renterInfo,
      photo: renterInfo?.photo ?? RENTER_DEFAULT_PHOTO,
    };
  };

  sendRenterInfoMessage: SendRenterInfo = async ctx => {
    const { text, photo, exists } = await this.getRenterInfoWithText(ctx);
    const keyboard = this.rentersKeyboardsService.renterInfoKeyboard;
    if (!exists) {
      await ctx.replyWithPhoto(photo, {
        caption: this.rentersTextsService.getFirstRenterInfoTip(text),
        reply_markup: keyboard,
      });
      return;
    }
    await ctx.replyWithPhoto(photo, {
      caption: text,
      reply_markup: keyboard,
    });
  };

  public createRenterWithGender: CreateRenterWithGender = async (gender, ctx) => {
    const chatId = ctx.from?.id?.toString() as string;
    await this.rentersApiService.create({ gender, chatId });
  };
}
