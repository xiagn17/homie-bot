import { Injectable } from '@nestjs/common';
import { InputMediaPhoto } from 'grammy/out/platform.node';
import { OBJECT_DEFAULT_PHOTO } from '../constants/imageUrls';
import { ObjectTypeEnum } from '../../api/renters/entities/RenterFilters.entity';
import { EMOJI_CELEBRATE } from '../constants/emoji';
import {
  SendLandlordObjectForm,
  SendObjectFormAddressQuestion,
  SendObjectFormApartmentsFloorsQuestion,
  SendObjectFormCommentQuestion,
  SendObjectFormDetailsQuestion,
  SendObjectFormLocationQuestion,
  SendObjectFormNameQuestion,
  SendObjectFormObjectTypeQuestion,
  SendObjectFormPhoneNumberQuestion,
  SendObjectFormPhotosQuestion,
  SendObjectFormPlaceOnSitesQuestion,
  SendObjectFormPriceQuestion,
  SendObjectFormRoomBedAverageAgeQuestion,
  SendObjectFormRoomBedPeopleNumberQuestion,
  SendObjectFormRoomBedPreferredGenderQuestion,
  SendObjectFormRoomsNumberQuestion,
  SendObjectFormStartArrivalDateQuestion,
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
  };

  public sendObjectFormPhoneNumberQuestion: SendObjectFormPhoneNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'phoneNumber';
    await ctx.reply(this.landlordsTextsService.getObjectFormPhoneNumberText(), {
      reply_markup: this.landlordsKeyboardsService.getPhoneNumberKeyboard(),
    });
  };

  public sendObjectFormObjectTypeQuestion: SendObjectFormObjectTypeQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'objectType';
    await ctx.reply(this.landlordsTextsService.getObjectFormObjectTypeText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormObjectTypeKeyboard(),
    });
  };

  public sendObjectFormStartArrivalDateQuestion: SendObjectFormStartArrivalDateQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'startArrivalDate';
    await ctx.reply(this.landlordsTextsService.getObjectFormStartArrivalDateText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormStartArrivalDateKeyboard(),
    });
  };

  public sendObjectFormPriceQuestion: SendObjectFormPriceQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'price';
    await ctx.reply(this.landlordsTextsService.getObjectFormPriceText());
  };

  public sendObjectFormLocationQuestion: SendObjectFormLocationQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'location';
    await ctx.reply(this.landlordsTextsService.getObjectFormLocationText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormLocationKeyboard(),
    });
  };

  public sendObjectFormAddressQuestion: SendObjectFormAddressQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'address';
    await ctx.reply(this.landlordsTextsService.getObjectFormAddressText());
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
  };

  public sendObjectFormDetailsQuestion: SendObjectFormDetailsQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'details';

    await ctx.reply(this.landlordsTextsService.getObjectFormDetailsText(), {
      reply_markup: await this.landlordsKeyboardsService.getLandlordObjectFormDetailsKeyboard(ctx),
    });
  };

  public sendObjectFormRoomsNumberQuestion: SendObjectFormRoomsNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'roomsNumber';

    const objectType = session.landlord.objectStepsData.objectType as ObjectTypeEnum;
    await ctx.reply(this.landlordsTextsService.getObjectFormRoomsNumberText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormRoomsNumberKeyboard(objectType),
    });
  };

  public sendObjectFormApartmentsFloorsQuestion: SendObjectFormApartmentsFloorsQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'floors';

    await ctx.reply(this.landlordsTextsService.getObjectFormApartmentsFloorsText());
  };

  public sendObjectFormRoomBedPeopleNumberQuestion: SendObjectFormRoomBedPeopleNumberQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'livingPeopleNumber';

    await ctx.reply(this.landlordsTextsService.getObjectFormRoomBedPeopleNumberText(), {
      reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormRoomBedPeopleNumberKeyboard(),
    });
  };

  public sendObjectFormRoomBedAverageAgeQuestion: SendObjectFormRoomBedAverageAgeQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'averageAge';

    await ctx.reply(this.landlordsTextsService.getObjectFormRoomBedAverageAgeText());
  };

  public sendObjectFormRoomBedPreferredGenderQuestion: SendObjectFormRoomBedPreferredGenderQuestion =
    async ctx => {
      const session = await ctx.session;
      session.landlord.objectStep = 'preferredGender';

      await ctx.reply(this.landlordsTextsService.getObjectFormRoomBedPreferredGenderText(), {
        reply_markup: this.landlordsKeyboardsService.getLandlordObjectFormPreferredGenderKeyboard(),
      });
    };

  public sendObjectFormCommentQuestion: SendObjectFormCommentQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'comment';

    await ctx.reply(this.landlordsTextsService.getObjectFormCommentText());
  };

  public sendObjectFormPlaceOnSitesQuestion: SendObjectFormPlaceOnSitesQuestion = async ctx => {
    const session = await ctx.session;
    session.landlord.objectStep = 'placeOnSites';
    session.landlord.objectStepsData.placeOnSites = true;

    await ctx.reply(`${EMOJI_CELEBRATE}`);
    await ctx.reply(this.landlordsTextsService.getObjectFormPlaceOnSitesText(), {
      reply_markup: await this.landlordsKeyboardsService.getLandlordObjectFormPlaceOnSitesKeyboard(ctx),
    });
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
        await ctx.reply(`Айдишник обьекта - ${object.id}\n\n#home${object.number}`);
      } else {
        const text = this.landlordsTextsService.getObjectFormModerationText(object.number);
        await ctx.reply(text);
      }
    } catch (e) {
      await ctx.reply('Упс, при сохранении произошла ошибка, обратитесь в поддержку или попробуйте еще раз');
    }
  };
}
