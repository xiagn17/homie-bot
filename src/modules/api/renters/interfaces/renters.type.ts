import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { SubwayStationEnumType } from '../../directories/interfaces/subway-stations.interface';
import { LocationEnumType } from '../../directories/interfaces/locations.interface';
import { MoneyRangeEnumType } from '../../directories/interfaces/money-ranges.interface';
import { InterestEnumType } from '../../directories/interfaces/interests.interface';

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
  id: string;
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  age: number;
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
  liveWithAnotherGender: WithAnotherGenderEnumType;
  ableContacts: number;
}
