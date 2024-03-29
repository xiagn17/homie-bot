import { RedisAdapter } from '@satont/grammy-redis-storage';
import { MiddlewareFn, LazySessionFlavor } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import { RentersInfoLifestyleInterface } from '../../../api/renters/interfaces/renters-info-lifestyle.interface';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import { PreferredGenderEnumType } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import { LandlordObjectApartmentsInfoInterface } from '../../../api/landlord-objects/interfaces/landlord-object-apartments-info.interface';
import { LandlordObjectRoomBedInfoInterface } from '../../../api/landlord-objects/interfaces/landlord-object-room-bed-info.interface';

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
export type RenterInfoFillFrom = 'menu' | string;
export type RenterInfoRouterSteps = 'find_object';
export interface RenterSessionData {
  infoStepsData: RenterInfoStepsData;
  infoStep?: RenterInfoStep;
  infoStepUpdate: boolean;
  infoFillFrom?: RenterInfoFillFrom;
  viewedObjects: number;
  firstMenuTip: boolean;
  filterStep?: 'priceRange';
  firstNoInfoWatning: boolean;

  router?: RenterInfoRouterSteps;
}

export interface LandlordObjectFormStepsData {
  name?: string;
  phoneNumber?: string;
  objectType?: ObjectTypeEnum;
  price?: string;
  location?: LocationsEnum;
  address?: string;
  photoIds?: string[];
  comment?: string;
  roomsNumber?: string;
  preferredGender?: PreferredGenderEnumType;
}

export type LandlordObjectFormStep =
  | keyof LandlordObjectFormStepsData
  | keyof LandlordObjectApartmentsInfoInterface
  | keyof LandlordObjectRoomBedInfoInterface;
export interface LandlordSessionData {
  firstTip: boolean;
  objectStepsData: LandlordObjectFormStepsData;
  objectStep?: LandlordObjectFormStep;
}
export interface SessionDataInterface {
  type?: TelegramUserType;
  renter: RenterSessionData;
  landlord: LandlordSessionData;
}
export type MySessionFlavour = LazySessionFlavor<SessionDataInterface>;

export type StorageInterface = RedisAdapter<SessionDataInterface>;
export type SessionStorageInterface = MiddlewareFn<MyContext & MySessionFlavour>;
