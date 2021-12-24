import { ApiTelegramUserResponseType, GenderEnumType } from '../renters/renters.type';
import { TelegramUserType } from '../telegram-bot/telegram-bot.types';
import { LocationEnumType } from '../../../entities/directories/Location.entity';
import { MoneyRangeEnumType } from '../../../entities/directories/MoneyRange.entity';

export enum MatchStatusEnumType {
  resolved = 'resolved',
  rejected = 'rejected',
  processing = 'processing',
}

export interface ApiAddPaidMatchesResponse {
  status: RenterStartMatchesStatus.ok;
  ableMatches: number;
}

export enum RenterStartMatchesStatus {
  ok = 'ok',
  fail = 'fail',
  redirected = 'redirected',
}
export interface ApiRenterStartMatchesResponse {
  status: RenterStartMatchesStatus;
}

export interface ApiRenterChangeStatusRequest extends TelegramUserType {
  matchId: string;
  status: MatchStatusEnumType.rejected | MatchStatusEnumType.resolved;
}

export interface TelegramPaidDataType {
  message_id: string;
  chat_type: string;
  chat_id: string;
  currency: 'RUB';
  total_amount: 19900;
  invoice_payload: 'buy-2-matches-payload';
  order_info: {
    name: string;
    phone_number: string;
  };
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}
export interface ApiRenterMatchesPaidRequest extends TelegramUserType {
  data: TelegramPaidDataType;
}

export interface MatchDataType {
  targetChatId: string;
  botId: string;
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
