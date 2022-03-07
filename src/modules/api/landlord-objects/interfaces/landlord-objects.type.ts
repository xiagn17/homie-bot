import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { LocationsEnum, ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';
import { LandlordObjectDetails } from './landlord-object-details.interface';
import { LandlordObjectRoomBedInfoInterface } from './landlord-object-room-bed-info.interface';
import { LandlordObjectApartmentsInfoInterface } from './landlord-object-apartments-info.interface';

export interface ApiLandlordObjectDraftBase<T = ObjectTypeEnum> extends TelegramUserType {
  name: string;
  phoneNumber: string;
  objectType: T;
  startArrivalDate: Date;
  price: string;
  location: LocationsEnum;
  address: string;
  photoIds: string[];
  details: LandlordObjectDetails;
  comment: string;
  roomsNumber: string;

  placeOnSites: boolean;
}
export type ApiLandlordObjectApartmentsDraft = ApiLandlordObjectDraftBase<ObjectTypeEnum.apartments> & {
  preferredGender: PreferredGenderEnumType.NO_DIFFERENCE;
  apartmentsInfo: LandlordObjectApartmentsInfoInterface;
};
export type ApiLandlordObjectRoomBedDraft = ApiLandlordObjectDraftBase<
  ObjectTypeEnum.room | ObjectTypeEnum.bed
> & {
  preferredGender: PreferredGenderEnumType;
  roomBedInfo: LandlordObjectRoomBedInfoInterface;
};
export type ApiLandlordObjectDraft = ApiLandlordObjectApartmentsDraft | ApiLandlordObjectRoomBedDraft;

export interface ApiLandlordObjectControlType {
  id: string;
  isApproved: boolean;
}

export type ApiLandlordObjectRenewType = TelegramUserType;
export type ApiLandlordObjectArchiveType = TelegramUserType;
export type ApiLandlordObjectResumeType = TelegramUserType;

export interface ApiObjectResponseBase<T = ObjectTypeEnum> {
  id: string;
  isAdmin: boolean;
  isApproved: boolean;
  stoppedAt: Date | null;
  number: number;
  placeOnSites: boolean;

  objectType: T;
  roomsNumber: string;
  details: LandlordObjectDetails;
  address: string;
  price: string;
  photoIds: string[];
  startArrivalDate: string;
  comment: string;
}
type ApiObjectApartmentsResponse = ApiObjectResponseBase<ObjectTypeEnum.apartments> & {
  apartmentsInfo: LandlordObjectApartmentsInfoInterface;
};
type ApiObjectRoomBedResponse = ApiObjectResponseBase<ObjectTypeEnum.room | ObjectTypeEnum.bed> & {
  roomBedInfo: LandlordObjectRoomBedInfoInterface;
};
export type ApiObjectResponse = ApiObjectApartmentsResponse | ApiObjectRoomBedResponse;
