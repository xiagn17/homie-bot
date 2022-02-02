import { TelegramUserResposeType, TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';

export interface ApiLandlordObjectType extends TelegramUserType {
  name: string;
  phoneNumber: string;
  address: string;
  averageAge: number;
  preferredGender: PreferredGenderEnumType;
  showCouples: boolean;
  showWithAnimals: boolean;
  startArrivalDate: Date;
  price: string;
  comment: string;
  photoIds: string[];
}

export interface ApiLandlordObjectControlType {
  id: string;
  isApproved: boolean;
}

export type ApiLandlordObjectRenewType = TelegramUserType;
export type ApiLandlordObjectArchiveType = TelegramUserType;

export interface ApiLandlordObjectFullResponseType extends TelegramUserResposeType {
  id: string;
  number: number;
  name: string;
  phoneNumber: string;
  address: string;
  preferredGender: PreferredGenderEnumType;
  startArrivalDate: string;
  price: string;
  photoIds: string;
  comment: string;
}
