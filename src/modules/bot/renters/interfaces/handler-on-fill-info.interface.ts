import { PhotoSize } from '@grammyjs/types';
import { MyContext } from '../../main/interfaces/bot.interface';
import { RenterInfoFillFrom } from '../../session-storage/interfaces/session-storage.interface';
import { RentersInfoLifestyleInterface } from '../../../api/renters/interfaces/renters-info-lifestyle.interface';

export type HandlerOnGenderRoute = (ctx: MyContext) => Promise<void>;

export type HandlerOnFillInfo = (from: RenterInfoFillFrom, ctx: MyContext) => Promise<void>;
export type HandlerOnAnswerName = (name: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnBirthdayYear = (birthdayYear: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnPhoneNumber = (phoneNumber: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnSocials = (socials: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnLifestyle = (
  changedField: keyof RentersInfoLifestyleInterface | 'create' | 'update',
  ctx: MyContext,
) => Promise<void>;
export type HandlerOnProfession = (profession: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnAbout = (about: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnPhotos = (photo: PhotoSize[] | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnPhotosKeyboard = (action: 'submit', ctx: MyContext) => Promise<void>;

export type HandlerOnUpdateName = (name: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnUpdateSocials = (socials: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnUpdateProfession = (profession: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnUpdateAbout = (about: string | undefined, ctx: MyContext) => Promise<void>;
export type HandlerOnUpdatePhotos = (photo: PhotoSize[] | undefined, ctx: MyContext) => Promise<void>;
