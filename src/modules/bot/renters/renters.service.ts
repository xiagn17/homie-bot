import { Injectable } from '@nestjs/common';
import { RenterObjectsService } from '../renter-objects/renter-objects.service';
import { RenterFilledInfoStepsData } from '../session-storage/interfaces/session-storage.interface';
import { RENTER_DEFAULT_PHOTO } from '../constants/imageUrls';
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
  };

  sendBirthdayYearQuestion: SendBirthdayYearQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'birthdayYear';
    await ctx.reply(this.rentersTextsService.getBirthdayYearQuestionText());
  };

  sendPhoneNumberQuestion: SendPhoneNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'phoneNumber';
    await ctx.reply(this.rentersTextsService.getPhoneNumberQuestionText(), {
      reply_markup: this.rentersKeyboardsService.getPhoneNumberKeyboard(),
    });
  };

  sendSocialsQuestion: SendSocialsQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'socials';
    await ctx.reply(this.rentersTextsService.getSocialsQuestionText(), {
      reply_markup: { remove_keyboard: true },
    });
  };

  sendLifestyleQuestion: SendLifestyleQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'lifestyle';
    await ctx.reply(this.rentersTextsService.getLifestyleQuestionText(), {
      reply_markup: await this.rentersKeyboardsService.getRenterInfoLifestyleKeyboard(ctx),
    });
  };

  sendProfessionQuestion: SendProfessionQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'profession';
    await ctx.reply(this.rentersTextsService.getProfessionQuestionText());
  };

  sendAboutQuestion: SendAboutQuestion = async ctx => {
    const session = await ctx.session;
    session.renter.infoStep = 'about';
    await ctx.reply(this.rentersTextsService.getAboutQuestionText());
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
    session.renter.infoStepUpdate = true;

    await this.sendPhotoQuestion(ctx);
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

    if (session.renter.infoFillFrom === 'object') {
      await this.renterObjectsService.sendNextObject(ctx);
    } else if (session.renter.infoFillFrom === 'menu') {
      await this.sendRenterInfoMessage(ctx);
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
    if (!exists) {
      await ctx.replyWithPhoto(photo, {
        caption: this.rentersTextsService.getFirstRenterInfoTip(text),
        reply_markup: this.rentersKeyboardsService.renterInfoKeyboard,
      });
      return;
    }
    await ctx.replyWithPhoto(photo, {
      caption: text,
      reply_markup: this.rentersKeyboardsService.renterInfoKeyboard,
    });
  };

  public createRenterWithGender: CreateRenterWithGender = async (gender, ctx) => {
    const chatId = ctx.from?.id?.toString() as string;
    await this.rentersApiService.create({ gender, chatId });

    await this.renterObjectsService.sendNextObject(ctx);
  };
}
