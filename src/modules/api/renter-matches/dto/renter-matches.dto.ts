import { IsString } from 'class-validator';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';
import {
  ApiRenterChangeStatusRequest,
  ApiRenterMatchesPaidRequest,
  MatchStatusEnumType,
  TelegramPaidDataType,
} from '../interfaces/renter-matches.type';

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
