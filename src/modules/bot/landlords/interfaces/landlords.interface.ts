import { MyContext } from '../../main/interfaces/bot.interface';

export type SendLandlordObjectForm = (ctx: MyContext) => Promise<void>;
export type SubmitObjectForm = (ctx: MyContext) => Promise<void>;

export type SendObjectFormNameQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormPhoneNumberQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormObjectTypeQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormPriceQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormLocationQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormAddressQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormPhotosQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormRoomsNumberQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormRoomBedPreferredGenderQuestion = (ctx: MyContext) => Promise<void>;
export type SendObjectFormCommentQuestion = (ctx: MyContext) => Promise<void>;
