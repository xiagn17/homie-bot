import { TelegramUserType } from '../telegram-bot/telegram-bot.types';
import { MatchStatusEnumType } from '../renter-matches/renter-matches.type';

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
