import { RedisAdapter } from '@satont/grammy-redis-storage';
import { MiddlewareFn, LazySessionFlavor } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import { RentersInfoLifestyleInterface } from '../../../api/renters/interfaces/renters-info-lifestyle.interface';

export enum TelegramUserType {
  renter = 'renter',
  landlord = 'landlord',
}

export interface RenterInfoStepsData {
  name?: string;
  birthdayYear?: number;
  phoneNumber?: string;
  socials?: string;
  lifestyle?: RentersInfoLifestyleInterface;
  profession?: string;
  about?: string;
  photo?: string;
}
export interface RenterFilledInfoStepsData extends RenterInfoStepsData {
  name: string;
  birthdayYear: number;
  phoneNumber: string;
  socials: string;
  lifestyle: RentersInfoLifestyleInterface;
  profession: string;
  about: string;
  photo: string;
}
export type RenterInfoStep = keyof RenterInfoStepsData;
export type RenterInfoFillFrom = 'object' | 'menu';
export interface RenterSessionData {
  infoStepsData: RenterInfoStepsData;
  infoStep?: RenterInfoStep;
  infoStepUpdate: boolean;
  infoFillFrom?: RenterInfoFillFrom;
  viewedObjects: number;
  firstMenuTip: boolean;
  filterStep?: 'priceRange';
}
export type LandlordSessionData = Record<any, any>;
export interface SessionDataInterface {
  type?: TelegramUserType;
  renter: RenterSessionData;
  landlord: LandlordSessionData;
}
export type MySessionFlavour = LazySessionFlavor<SessionDataInterface>;

export type StorageInterface = RedisAdapter<SessionDataInterface>;
export type SessionStorageInterface = MiddlewareFn<MyContext & MySessionFlavour>;
