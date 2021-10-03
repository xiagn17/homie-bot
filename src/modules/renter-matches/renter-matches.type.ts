import { ApiRenterResponseType } from '../renters/renters.type';

export enum MatchStatusEnumType {
  resolved = 'resolved',
  rejected = 'rejected',
  able = 'able',
  processing = 'processing',
}

export interface ApiAddPaidMatchesResponse {
  success: true;
  ableMatches: number;
}
export interface ApiRenterStartMatchesResponse {
  success: boolean;
  error: 'need payment' | '' | string;
}

export interface ApiRenterChangeStatusRequest {
  matchId: string;
  status: MatchStatusEnumType.rejected | MatchStatusEnumType.resolved;
}

export interface MatchDataType {
  targetChatId: string;
  matchedRenter: ApiRenterResponseType;
  matchId: string;
}
