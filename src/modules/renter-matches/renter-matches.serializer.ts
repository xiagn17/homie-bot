import { Injectable } from '@nestjs/common';
import { Renter } from '../../entities/users/Renter';
import { RenterMatch } from '../../entities/matches/RenterMatch';
import { RentersSerializer } from '../renters/renters.serializer';
import { MatchDataType } from './renter-matches.type';

@Injectable()
export class RenterMatchesSerializer {
  constructor(private rentersSerializer: RentersSerializer) {}

  prepareMatchData(matchedRenters: [Renter, Renter], match: RenterMatch): MatchDataType[] {
    return matchedRenters.map((renter, i, renters) => {
      return {
        targetChatId: renter.telegramUser.chatId,
        matchedRenter: this.rentersSerializer.toResponse(renters[i + 1] ?? renters[i - 1]),
        matchId: match.id,
      };
    });
  }
}
