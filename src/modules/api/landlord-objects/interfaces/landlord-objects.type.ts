import { TelegramUserResposeType, TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';
import { LandlordObjectDetailsInterface } from './landlord-object-details.interface';
import { LandlordObjectRoomBedInfoInterface } from './landlord-object-room-bed-info.interface';
import { LandlordObjectApartmentsInfoInterface } from './landlord-object-apartments-info.interface';

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

export interface ApiObjectPreviewInterface {
  id: string;
  isAdmin: boolean;
  number: number;
  objectType: ObjectTypeEnum;
  roomsNumber: string;
  details: LandlordObjectDetailsInterface;
  roomBedInfo: LandlordObjectRoomBedInfoInterface | null;
  apartmentsInfo: LandlordObjectApartmentsInfoInterface | null;

  address: string;
  price: string;
  photoIds: string[];
  startArrivalDate: string;
  comment: string;
}
