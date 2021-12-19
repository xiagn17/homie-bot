import { Injectable } from '@nestjs/common';
import { MatchDataType } from '../api/renter-matches/renter-matches.type';
import { FlowXoFlowRunDataType } from './flow-xo.type';

@Injectable()
export class FlowXoSerializer {
  prepareMatchData(matchData: MatchDataType, isExistingMatch: boolean): FlowXoFlowRunDataType {
    return {
      ...this.prepareRunFlowData(matchData.targetChatId, matchData.botId),
      data: {
        isExistingMatch,
        renter: matchData.matchedRenter,
        matchId: matchData.matchId,
      },
    };
  }

  preparePayMatchData(chatId: string, botId: string): FlowXoFlowRunDataType {
    return this.prepareRunFlowData(chatId, botId);
  }

  private prepareRunFlowData(chatId: string, botId: string): FlowXoFlowRunDataType {
    return {
      bot_connection_id: botId,
      bot_id: botId,
      chat_id: chatId,
      response_path: `${botId}/c/${chatId}`,
    };
  }
}
