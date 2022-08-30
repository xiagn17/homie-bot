import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { LocationsEnum, ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';

export interface ApiLandlordObjectDraft extends TelegramUserType {
  name: string;
  phoneNumber: string;
  objectType: ObjectTypeEnum;
  price: string;
  location: LocationsEnum;
  address: string;
  photoIds: string[];
  comment: string;
  roomsNumber: string;
  preferredGender: PreferredGenderEnumType;
}

export interface ApiLandlordObjectControlType {
  id: string;
  isApproved: boolean;
}

export type ApiLandlordObjectRenewType = TelegramUserType;
export type ApiLandlordObjectArchiveType = TelegramUserType;
export type ApiLandlordObjectResumeType = TelegramUserType;

export type ApiObjectResponse = {
  id: string;
  isAdmin: boolean;
  isApproved: boolean;
  isActive: boolean;
  number: number;

  objectType: ObjectTypeEnum;
  roomsNumber: string;
  address: string;
  price: string;
  photoIds: string[];
  comment: string;
};
