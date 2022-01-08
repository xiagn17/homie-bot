import { TelegramUserResposeType, TelegramUserType } from '../telegram-bot/telegram-bot.types';
import { LocationEnumType } from '../../../entities/directories/Location.entity';
import { PreferredGenderEnumType } from '../../../entities/landlord-objects/LandlordObject.entity';
import { SubwayStationEnumType } from '../../../entities/directories/SubwayStation.entity';

export interface ApiLandlordObjectType extends TelegramUserType {
  name: string;
  phoneNumber: string;
  location: LocationEnumType;
  address: string;
  subwayStations: SubwayStationEnumType[];
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
  location: LocationEnumType;
  address: string;
  subwayStations: string;
  averageAge: number;
  preferredGender: PreferredGenderEnumType;
  showCouples: boolean;
  showWithAnimals: boolean;
  startArrivalDate: string;
  price: string;
  photoIds: string;
  comment: string;
}
