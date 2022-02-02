import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';

export interface ApiTelegramUserResponseType {
  username: string;
}

export interface RenterInterface extends TelegramUserType {
  gender: GenderEnumType;
}

export enum GenderEnumType {
  MALE = 'male',
  FEMALE = 'female',
}

export interface ApiRenterFullType {
  isRenter: 'yes' | 'no';
  renter: ApiRenterResponseType | undefined;
}

export interface ApiRenterResponseType extends ApiTelegramUserResponseType {
  id: string;
  gender: GenderEnumType;
}
