import { IsString } from 'class-validator';
import { ApiChangeRenterStatusOfObject } from '../interfaces/landlord-renter-matches.types';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';
import { MatchStatusEnumType } from '../../renter-matches/interfaces/renter-matches.type';

export class ChangeRenterStatusOfObjectDto
  extends TelegramChatIdDTO
  implements ApiChangeRenterStatusOfObject
{
  @IsString()
  landlordObjectId: string;

  @IsString()
  renterStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}
