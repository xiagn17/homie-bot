import { MyContext } from '../../main/interfaces/bot.interface';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';

export type SendNameQuestion = (ctx: MyContext) => Promise<void>;
export type SendBirthdayYearQuestion = (ctx: MyContext) => Promise<void>;
export type SendPhoneNumberQuestion = (ctx: MyContext) => Promise<void>;
export type SendSocialsQuestion = (ctx: MyContext) => Promise<void>;
export type SendLifestyleQuestion = (ctx: MyContext) => Promise<void>;
export type SendProfessionQuestion = (ctx: MyContext) => Promise<void>;
export type SendAboutQuestion = (ctx: MyContext) => Promise<void>;
export type SendPhotoQuestion = (ctx: MyContext) => Promise<void>;
export type SubmitRenterInfo = (ctx: MyContext) => Promise<void>;
export type AutoSubmitRenterInfo = (ctx: MyContext) => Promise<void>;

export type SendUpdateName = (ctx: MyContext) => Promise<void>;
export type UpdateRenterName = (name: string, ctx: MyContext) => Promise<void>;
export type SendUpdateSocials = (ctx: MyContext) => Promise<void>;
export type UpdateRenterSocials = (socials: string, ctx: MyContext) => Promise<void>;
export type SendUpdateLifestyle = (ctx: MyContext) => Promise<void>;
export type UpdateRenterLifestyle = (ctx: MyContext) => Promise<void>;
export type SendUpdateProfession = (ctx: MyContext) => Promise<void>;
export type UpdateRenterProfession = (profession: string, ctx: MyContext) => Promise<void>;
export type SendUpdateAbout = (ctx: MyContext) => Promise<void>;
export type SendUpdatePhoto = (ctx: MyContext) => Promise<void>;
export type UpdateRenterAbout = (about: string, ctx: MyContext) => Promise<void>;
export type UpdateRenterPhoto = (photo: string, ctx: MyContext) => Promise<void>;

export type GetFiltersText = (ctx: MyContext) => Promise<string>;
export type SendFilters = (ctx: MyContext) => Promise<void>;
export type UpdateFiltersObjectTypes = (objectType: ObjectTypeEnum, ctx: MyContext) => Promise<void>;
export type UpdateFiltersLocation = (location: LocationsEnum, ctx: MyContext) => Promise<void>;
export type UpdateFiltersPriceRange = (
  priceRangeStart: number,
  priceRangeEnd: number,
  ctx: MyContext,
) => Promise<void>;
export type SendFiltersPriceQuestion = (ctx: MyContext) => Promise<void>;
export type SendFiltersLocationQuestion = (ctx: MyContext) => Promise<void>;

export type GetRenterInfoWithText = (
  ctx: MyContext,
) => Promise<{ text: string; exists: boolean; photo: string }>;
export type SendRenterInfo = (ctx: MyContext) => Promise<void>;

export type CreateRenterWithGender = (gender: GenderEnumType, ctx: MyContext) => Promise<void>;
export type SendOnboarding = (ctx: MyContext) => Promise<void>;
