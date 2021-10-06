import {
  ApiTelegramUserResponseType,
  GenderEnumType,
  LocationEnumType,
  MoneyRangeEnumType,
} from '../renters/renters.type';

export enum MatchStatusEnumType {
  resolved = 'resolved',
  rejected = 'rejected',
  processing = 'processing',
}

export interface ApiAddPaidMatchesResponse {
  success: true;
  ableMatches: number;
}
export interface ApiRenterStartMatchesResponse {
  success: boolean;
  error: 'need payment' | '' | string;
}

export interface ApiRenterChangeStatusRequest {
  matchId: string;
  status: MatchStatusEnumType.rejected | MatchStatusEnumType.resolved;
}

export interface MatchDataType {
  targetChatId: string;
  matchedRenter: ApiRenterMatchResponseType;
  matchId: string;
}

export interface ApiRenterMatchResponseType extends ApiTelegramUserResponseType {
  name: string;
  gender: GenderEnumType;
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
}
