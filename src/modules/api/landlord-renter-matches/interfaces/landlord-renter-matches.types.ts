import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { MatchStatusEnumType } from '../../renter-matches/interfaces/renter-matches.type';

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
