import { Injectable, OnModuleInit } from '@nestjs/common';
import { Composer } from 'grammy';
import { Router } from '@grammyjs/router';
import { MyContext } from '../../main/interfaces/bot.interface';
import {
  HandlerOnAbout,
  HandlerOnAnswerName,
  HandlerOnBirthdayYear,
  HandlerOnFillInfo,
  HandlerOnGenderRoute,
  HandlerOnLifestyle,
  HandlerOnPhoneNumber,
  HandlerOnPhotos,
  HandlerOnPhotosKeyboard,
  HandlerOnProfession,
  HandlerOnSocials,
  HandlerOnUpdateAbout,
  HandlerOnUpdateName,
  HandlerOnUpdatePhotos,
  HandlerOnUpdateProfession,
  HandlerOnUpdateSocials,
} from '../interfaces/handler-on-fill-info.interface';
import {
  RenterInfoFillFrom,
  TelegramUserType,
} from '../../session-storage/interfaces/session-storage.interface';
import { RentersService } from '../renters.service';
import {
  HandlerOnFiltersLocation,
  HandlerOnFiltersObjectTypes,
  HandlerOnFiltersPriceQuestion,
  HandlerOnGender,
} from '../interfaces/renter-handlers.interface';
import { RentersInfoLifestyleInterface } from '../../../api/renters/interfaces/renters-info-lifestyle.interface';
import { RentersKeyboardsService } from '../keyboards/renters-keyboards.service';
import { RentersTextsService } from '../texts/renters-texts.service';
import { RentersApiService } from '../api/renters-api.service';
import { validateBirthdayYear } from './helpers/birthdayYear.validate';
import { validatePhoneNumber } from './helpers/phoneNumber.validate';
import { validateSocials } from './helpers/socials.validate';
import { validateFiltersPrice } from './helpers/filtersPrice.validate';

const ROUTE_GENDER = 'route-gender';
const ROUTE_FILTER_PRICE = 'filters-price-question';

@Injectable()
export class RentersHandlersService implements OnModuleInit {
  composer: Composer<MyContext> = new Composer<MyContext>().filter(async ctx => {
    const session = await ctx.session;
    return session.type === TelegramUserType.renter;
  });

  public routerFilters: Router<MyContext> = new Router<MyContext>(async ctx => {
    const session = await ctx.session;
    const userType = session.type;
    if (userType === TelegramUserType.renter) {
      const showPriceQuestion = session.renter.filterStep === 'priceRange';
      const priceRoute = showPriceQuestion ? ROUTE_FILTER_PRICE : undefined;
      return priceRoute;
    }
    return undefined;
  });

  public routerGender: Router<MyContext> = new Router<MyContext>(async ctx => {
    const session = await ctx.session;
    const { type } = session;
    if (type === TelegramUserType.renter) {
      const chatId = ctx.from?.id.toString() as string;
      const isExists = await this.rentersApiService.isRenterExists(chatId);
      return !isExists ? ROUTE_GENDER : undefined;
    }
    return undefined;
  });

  constructor(
    private readonly rentersService: RentersService,
    private readonly rentersKeyboardsService: RentersKeyboardsService,
    private readonly rentersTextsService: RentersTextsService,
    private readonly rentersApiService: RentersApiService,
  ) {}

  onModuleInit(): void {
    this.rentersKeyboardsService.initGender(this.onGenderHandler);

    this.composer.callbackQuery(/^info_fill_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const from: RenterInfoFillFrom = data.split('info_fill_')[1];
      await this.onFillInfoHandler(from, ctx);
      await ctx.answerCallbackQuery();
    });
    this.composer.callbackQuery(/^renterInfo_lifestyle_/, async ctx => {
      const data = ctx.callbackQuery.data;
      const changedField = data.split('renterInfo_lifestyle_')[1] as
        | keyof RentersInfoLifestyleInterface
        | 'create'
        | 'update';
      await this.onCallbackLifestyleKeyboard(changedField, ctx);
      await ctx.answerCallbackQuery();
    });

    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'name' && !session.renter.infoStepUpdate;
      },
      ctx => this.onAnswerNameHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'birthdayYear' && !session.renter.infoStepUpdate;
      },
      ctx => this.onAnswerBirthdayYearHandler(ctx.msg.text, ctx),
    );
    this.composer.on('msg').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'phoneNumber' && !session.renter.infoStepUpdate;
      },
      ctx => {
        const phoneNumber = ctx.msg.contact?.phone_number ?? ctx.msg.text;
        return this.onAnswerPhoneNumberHandler(phoneNumber, ctx);
      },
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'socials' && !session.renter.infoStepUpdate;
      },
      ctx => this.onAnswerSocialsHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'profession' && !session.renter.infoStepUpdate;
      },
      ctx => this.onAnswerProfessionHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'about' && !session.renter.infoStepUpdate;
      },
      ctx => this.onAnswerAboutHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'photo' && !session.renter.infoStepUpdate;
      },
      ctx => this.onAnswerPhotosHandler(ctx.message.photo, ctx),
    );
    this.composer.callbackQuery(/^renterInfo_photos_/).filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'photo' && !session.renter.infoStepUpdate;
      },
      async ctx => {
        const data = ctx.callbackQuery.data;
        const action = data.split('renterInfo_photos_')[1] as 'submit';
        await this.onCallbackPhotosKeyboard(action, ctx);
        await ctx.answerCallbackQuery();
      },
    );

    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'name' && session.renter.infoStepUpdate;
      },
      ctx => this.onUpdateNameHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'socials' && session.renter.infoStepUpdate;
      },
      ctx => this.onUpdateSocialsHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'profession' && session.renter.infoStepUpdate;
      },
      ctx => this.onUpdateProfessionHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message:text').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'about' && session.renter.infoStepUpdate;
      },
      ctx => this.onUpdateAboutHandler(ctx.msg.text, ctx),
    );
    this.composer.on('message').filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'photo' && session.renter.infoStepUpdate;
      },
      ctx => this.onUpdatePhotosHandler(ctx.message.photo, ctx),
    );
    this.composer.callbackQuery(/^renterInfo_photos_/).filter(
      async ctx => {
        const session = await ctx.session;
        return session.renter.infoStep === 'photo' && session.renter.infoStepUpdate;
      },
      async ctx => {
        const data = ctx.callbackQuery.data;
        const action = data.split('renterInfo_photos_')[1] as 'submit';
        await this.onCallbackPhotosUpdateKeyboard(action, ctx);
        await ctx.answerCallbackQuery();
      },
    );

    this.routerFilters.route(ROUTE_FILTER_PRICE, this.onFiltersPriceQuestionHandler);
    this.routerGender.route(ROUTE_GENDER, this.onGenderRouteHandler);
  }

  onGenderRouteHandler: HandlerOnGenderRoute = async ctx => {
    const text = this.rentersTextsService.getGenderText();
    await ctx.reply(text, {
      reply_markup: this.rentersKeyboardsService.genderKeyboard,
    });
  };

  onFillInfoHandler: HandlerOnFillInfo = async (from, ctx) => {
    const session = await ctx.session;
    session.renter.infoFillFrom = from;

    await this.rentersService.sendNameQuestion(ctx);
  };

  onAnswerNameHandler: HandlerOnAnswerName = async (name, ctx) => {
    if (!name) {
      await this.rentersService.sendNameQuestion(ctx);
      return;
    }
    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.name = name;
    session.renter.infoStepsData = infoStepsData;

    await this.rentersService.sendBirthdayYearQuestion(ctx);
  };

  onAnswerBirthdayYearHandler: HandlerOnBirthdayYear = async (birthdayYear, ctx) => {
    if (!birthdayYear || !validateBirthdayYear(birthdayYear)) {
      await this.rentersService.sendBirthdayYearQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.birthdayYear = Number(birthdayYear);
    session.renter.infoStepsData = infoStepsData;

    await this.rentersService.sendPhoneNumberQuestion(ctx);
  };

  onAnswerPhoneNumberHandler: HandlerOnPhoneNumber = async (phoneNumber, ctx) => {
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      await this.rentersService.sendPhoneNumberQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.phoneNumber = phoneNumber;
    session.renter.infoStepsData = infoStepsData;

    await this.rentersService.sendSocialsQuestion(ctx);
  };

  onAnswerSocialsHandler: HandlerOnSocials = async (socials, ctx) => {
    if (!socials || !validateSocials(socials)) {
      await this.rentersService.sendSocialsQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.socials = socials;
    session.renter.infoStepsData = infoStepsData;

    await this.rentersService.sendLifestyleQuestion(ctx);
  };

  onAnswerProfessionHandler: HandlerOnProfession = async (profession, ctx) => {
    if (!profession) {
      await this.rentersService.sendProfessionQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.profession = profession;
    session.renter.infoStepsData = infoStepsData;

    await this.rentersService.sendAboutQuestion(ctx);
  };

  onAnswerAboutHandler: HandlerOnAbout = async (about, ctx) => {
    if (!about) {
      await this.rentersService.sendAboutQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.about = about;
    session.renter.infoStepsData = infoStepsData;

    await this.rentersService.sendPhotoQuestion(ctx);
  };

  onAnswerPhotosHandler: HandlerOnPhotos = async (photos, ctx) => {
    if (!photos) {
      await this.rentersService.sendPhotoQuestion(ctx);
      return;
    }

    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.photo = photos[photos.length - 1].file_id;
    session.renter.infoStepsData = infoStepsData;

    await ctx.deleteMessage();
    await this.rentersService.sendPhotoQuestion(ctx);
  };

  onCallbackPhotosKeyboard: HandlerOnPhotosKeyboard = async (action, ctx) => {
    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    if (action === 'submit' && infoStepsData.photo) {
      await this.rentersService.submitRenterInfo(ctx);
    }
  };

  onCallbackPhotosUpdateKeyboard: HandlerOnPhotosKeyboard = async (action, ctx) => {
    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    if (action === 'submit' && infoStepsData.photo) {
      await this.rentersService.updateRenterPhoto(infoStepsData.photo, ctx);

      const session = await ctx.session;
      session.renter.infoStepUpdate = false;
      session.renter.infoStep = undefined;
    }
  };

  onFiltersObjectTypesHandler: HandlerOnFiltersObjectTypes = async (objectType, ctx) => {
    await this.rentersService.updateFiltersObjectTypes(objectType, ctx);
    const text = await this.rentersService.getFiltersText(ctx);

    ctx.menu.update();
    await ctx.editMessageText(text);
  };

  onFiltersLocationHandler: HandlerOnFiltersLocation = async (location, ctx) => {
    await this.rentersService.updateFiltersLocation(location, ctx);
    ctx.menu.update();
  };

  onFiltersPriceQuestionHandler: HandlerOnFiltersPriceQuestion = async ctx => {
    const priceRange = ctx.msg?.text;
    if (!priceRange || !validateFiltersPrice(priceRange)) {
      await this.rentersService.sendFiltersPriceQuestion(ctx);
      return;
    }
    const session = await ctx.session;
    session.renter.filterStep = undefined;

    const priceRangeStart = Number(priceRange.split('-')[0]);
    const priceRangeEnd = Number(priceRange.split('-')[1]);
    await this.rentersService.updateFiltersPriceRange(priceRangeStart, priceRangeEnd, ctx);
  };

  onUpdateNameHandler: HandlerOnUpdateName = async (name, ctx) => {
    if (!name) {
      await this.rentersService.sendUpdateName(ctx);
      return;
    }

    await this.rentersService.updateRenterName(name, ctx);
    const session = await ctx.session;
    session.renter.infoStepUpdate = false;
    session.renter.infoStep = undefined;
  };

  onUpdateSocialsHandler: HandlerOnUpdateSocials = async (socials, ctx) => {
    if (!socials) {
      await this.rentersService.sendUpdateSocials(ctx);
      return;
    }

    await this.rentersService.updateRenterSocials(socials, ctx);
    const session = await ctx.session;
    session.renter.infoStepUpdate = false;
    session.renter.infoStep = undefined;
  };

  onUpdateProfessionHandler: HandlerOnUpdateProfession = async (profession, ctx) => {
    if (!profession) {
      await this.rentersService.sendUpdateProfession(ctx);
      return;
    }

    await this.rentersService.updateRenterProfession(profession, ctx);
    const session = await ctx.session;
    session.renter.infoStepUpdate = false;
    session.renter.infoStep = undefined;
  };

  onUpdateAboutHandler: HandlerOnUpdateAbout = async (about, ctx) => {
    if (!about) {
      await this.rentersService.sendUpdateProfession(ctx);
      return;
    }

    await this.rentersService.updateRenterAbout(about, ctx);
    const session = await ctx.session;
    session.renter.infoStepUpdate = false;
    session.renter.infoStep = undefined;
  };

  onUpdatePhotosHandler: HandlerOnUpdatePhotos = async (photos, ctx) => {
    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};

    if (photos) {
      infoStepsData.photo = photos[photos.length - 1].file_id;
      session.renter.infoStepsData = infoStepsData;
    }

    await ctx.deleteMessage();
    await this.rentersService.sendUpdatePhoto(ctx);
  };

  onCallbackLifestyleKeyboard: HandlerOnLifestyle = async (changedField, ctx) => {
    const session = await ctx.session;
    const infoStepsData = session.renter.infoStepsData ?? {};
    infoStepsData.lifestyle = infoStepsData.lifestyle ?? {
      dogCat: false,
      smallAnimals: false,
      dontSmoke: false,
      dontDrink: false,
      kids: false,
      workRemotely: false,
    };

    if (changedField === 'create') {
      return this.rentersService.sendProfessionQuestion(ctx);
    } else if (changedField === 'update') {
      await ctx.editMessageReplyMarkup({
        reply_markup: undefined,
      });
      session.renter.infoStep = undefined;
      session.renter.infoStepUpdate = false;
      return this.rentersService.updateRenterLifestyle(ctx);
    }

    infoStepsData.lifestyle[changedField] = !infoStepsData.lifestyle[changedField];

    await ctx.editMessageReplyMarkup({
      reply_markup: await this.rentersKeyboardsService.getRenterInfoLifestyleKeyboard(ctx),
    });
  };

  private onGenderHandler: HandlerOnGender = async (gender, ctx, next) => {
    ctx.menu.close();
    const text = this.rentersTextsService.getGenderText(gender);
    await ctx.editMessageText(text);
    await ctx.reply('Подбор подходящих объектов...');

    await this.rentersService.createRenterWithGender(gender, ctx);

    await next();
  };
}
