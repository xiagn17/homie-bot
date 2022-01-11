import { TelegramUserResposeType, TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { SubwayStationEnumType } from '../../directories/interfaces/subway-stations.interface';
import { LocationEnumType } from '../../directories/interfaces/locations.interface';

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
