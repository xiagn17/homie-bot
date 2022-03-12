import { NextFunction } from 'grammy';
import { Middleware } from 'grammy/out/composer';
import { Filter } from 'grammy/out/filter';
import { MenuFlavor } from '@grammyjs/menu/out/menu';
import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerLandlordOnFirstTip = (ctx: MyContext, next: NextFunction) => Promise<void>;
export type HandlerLandlordObjectForm = (ctx: MyContext) => Promise<void>;
export type HandlerDeleteObject = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;

export type HandlerObjectFormNameQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormPhoneNumberQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormObjectTypeQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormStartArrivalDateQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormPriceQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormLocationQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormAddressQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormPhotosQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormDetailsQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormRoomsNumberQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormApartmentsFloorsQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormRoomBedPeopleNumberQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormRoomBedAverageAgeQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormRoomBedPreferredGenderQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormCommentQuestion = (ctx: MyContext) => Promise<void>;
export type HandlerObjectFormPlaceOnSitesQuestion = (ctx: MyContext) => Promise<void>;

export type HandlerObjectRenewCallback = Middleware<Filter<MyContext, 'callback_query:data'>>;

export type HandlerOnLandlordObjectStopResume = (
  isActive: boolean,
  ctx: Filter<MyContext, 'callback_query:data'> & MenuFlavor,
  next: NextFunction,
) => Promise<void>;
