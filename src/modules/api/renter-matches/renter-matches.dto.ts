import { IsString } from 'class-validator';
import { TelegramChatIdDTO } from '../telegram-bot/telegram-bot.dto';
import {
  ApiRenterChangeStatusRequest,
  ApiRenterMatchesPaidRequest,
  MatchStatusEnumType,
  TelegramPaidDataType,
} from './renter-matches.type';

export class RenterMatchesChangeStatusDTO implements ApiRenterChangeStatusRequest {
  @IsString()
  matchId: string;

  @IsString()
  status: MatchStatusEnumType.rejected | MatchStatusEnumType.resolved;

  @IsString()
  chatId: string;
}

export class RenterMatchesPaidDTO extends TelegramChatIdDTO implements ApiRenterMatchesPaidRequest {
  data: TelegramPaidDataType;
}
