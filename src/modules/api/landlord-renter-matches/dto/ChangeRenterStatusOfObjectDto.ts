import { IsString } from 'class-validator';
import { ApiChangeRenterStatusOfObject } from '../landlord-renter-matches.types';
import { TelegramChatIdDTO } from '../../telegram-bot/telegram-bot.dto';
import { MatchStatusEnumType } from '../../renter-matches/renter-matches.type';

export class ChangeRenterStatusOfObjectDto
  extends TelegramChatIdDTO
  implements ApiChangeRenterStatusOfObject
{
  @IsString()
  landlordObjectId: string;

  @IsString()
  renterStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}
