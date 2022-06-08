import { TelegramUserResposeType, TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';

export interface RenterDraftInterface extends TelegramUserType {
  gender: GenderEnumType;
}

export enum GenderEnumType {
  MALE = 'male',
  FEMALE = 'female',
}

export interface ApiRenterFull extends ApiRenterResponseType {
  settings: ApiRenterSettings;
}

export interface ApiRenterResponseType extends TelegramUserResposeType {
  id: string;
  gender: GenderEnumType;
}

export interface ApiRenterSettings {
  inSearch: boolean;
  renterId: string;
  subscriptionStarted: Date | null;
  subscriptionEnds: Date | null;
  subscriptionTrialStarted: Date | null;
  subscriptionTrialEnds: Date | null;
}
