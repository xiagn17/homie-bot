import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { RentersInfoLifestyleInterface } from './renters-info-lifestyle.interface';
import { GenderEnumType } from './renters.type';

export interface ApiRenterInfo {
  name: string;
  birthdayYear: number;
  phoneNumber: string;
  zodiacSign: string | null;
  socials: string;
  lifestyle: RentersInfoLifestyleInterface;
  profession: string;
  about: string;
  photo: string;
  renterId: string;
}

export interface ApiRenterFullInfo extends ApiRenterInfo {
  gender: GenderEnumType;
  username: string;
}

export interface ApiRenterInfoDraft extends TelegramUserType {
  name: string;
  birthdayYear: number;
  phoneNumber: string;
  zodiacSign: string | null;
  socials: string;
  lifestyle: RentersInfoLifestyleInterface;
  profession: string;
  about: string;
  photo: string;
}

export interface ApiRenterInfoUpdateDraft extends Partial<ApiRenterInfoDraft> {
  chatId: string;
}
