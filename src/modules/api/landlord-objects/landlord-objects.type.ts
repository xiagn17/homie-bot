import { TelegramUserType } from '../telegram-bot/telegram-bot.types';
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
  photoUrls: string[];
}

export interface ApiLandlordObjectDraftType extends TelegramUserType {
  name: string;
  phoneNumber: string;
  location: LocationEnumType;
  address: string;
  subwayStations: string;
  averageAge: string;
  preferredGender: PreferredGenderEnumType;
  showCouples: 'true' | 'false';
  showWithAnimals: 'true' | 'false';
  startArrivalDate: string;
  price: string;
  comment: string;
  photoUrls: string[];
}

// export interface ApiLandlordObjectResponseType {
//   name: string;
//   gender: GenderEnumType;
//   birthdayYear: number;
//   phone: string;
//   moneyRange: MoneyRangeEnumType;
//   plannedArrivalDate: string;
//   location: LocationEnumType;
//   subwayStations: string;
//   zodiacSign: string;
//   university: string;
//   interests: string;
//   preferences: string;
//   socials: string;
//   withAnimals: boolean;
// }
