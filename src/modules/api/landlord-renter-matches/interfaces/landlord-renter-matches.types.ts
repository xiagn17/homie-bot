import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';

export enum MatchStatusEnumType {
  resolved = 'resolved',
  rejected = 'rejected',
  processing = 'processing',
}

export interface ApiChangeRenterStatusOfObject extends TelegramUserType {
  landlordObjectId: string;
  renterStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}

export interface ApiChangeLandlordStatusOfObject {
  landlordObjectId: string;
  renterId: string;
  landlordStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}

export interface ApiSetRenterLastInLandlordQueue {
  landlordObjectId: string;
  renterId: string;
}
