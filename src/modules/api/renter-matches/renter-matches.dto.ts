import { IsString } from 'class-validator';
import { ApiRenterChangeStatusRequest, MatchStatusEnumType } from './renter-matches.type';

export class RenterMatchesChangeStatusDTO implements ApiRenterChangeStatusRequest {
  @IsString()
  matchId: string;

  @IsString()
  status: MatchStatusEnumType.rejected | MatchStatusEnumType.resolved;
}
