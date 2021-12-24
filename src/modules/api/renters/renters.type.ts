import { TelegramUserType } from '../telegram-bot/telegram-bot.types';
import { LocationEnumType } from '../../../entities/directories/Location.entity';
import { SubwayStationEnumType } from '../../../entities/directories/SubwayStation.entity';
import { InterestEnumType } from '../../../entities/directories/Interest.entity';
import { MoneyRangeEnumType } from '../../../entities/directories/MoneyRange.entity';

export interface ApiTelegramUserResponseType {
  username: string;
}

export interface RenterType extends TelegramUserType {
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  phone: string;
  moneyRange: MoneyRangeEnumType;
  plannedArrivalDate: Date;
  location: LocationEnumType;
  subwayStations: SubwayStationEnumType[];
  zodiacSign?: string;
  university?: string;
  interests?: InterestEnumType[];
  preferences?: string;
  socials: string;
  liveWithAnotherGender: WithAnotherGenderEnumType;
  withAnimals: boolean;
}

export interface RenterDraftType extends TelegramUserType {
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  phone: string;
  moneyRange: MoneyRangeEnumType;
  plannedArrivalDate: string;
  location: LocationEnumType;
  subwayStations: string;
  zodiacSign?: string;
  university?: string;
  interests?: string;
  preferences?: string;
  socials: string;
  liveWithAnotherGender: WithAnotherGenderEnumType;
  withAnimals: 'true' | 'false';
}

export enum GenderEnumType {
  MALE = 'male',
  FEMALE = 'female',
}

export enum WithAnotherGenderEnumType {
  yes = 'yes',
  not = 'not',
}

export interface ApiRenterFullType {
  isRenter: 'yes' | 'no';
  renter: ApiRenterResponseType | undefined;
  ableMatches: number | undefined;
}

export interface ApiRenterResponseType extends ApiTelegramUserResponseType {
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  phone: string;
  moneyRange: MoneyRangeEnumType;
  plannedArrivalDate: string;
  location: LocationEnumType;
  subwayStations: string;
  zodiacSign: string;
  university: string;
  interests: string;
  preferences: string;
  socials: string;
  withAnimals: boolean;
}
