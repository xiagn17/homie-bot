import { IsString } from 'class-validator';
import {
  ApiChangeRenterStatusOfObject,
  MatchStatusEnumType,
} from '../interfaces/landlord-renter-matches.types';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';

export class ChangeRenterStatusOfObjectDto
  extends TelegramChatIdDTO
  implements ApiChangeRenterStatusOfObject
{
  @IsString()
  landlordObjectId: string;

  @IsString()
  renterStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}
