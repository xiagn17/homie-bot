import { Injectable } from '@nestjs/common';
import { MatchDataType } from '../api/renter-matches/renter-matches.type';
import { SendpulseFlowRunDataType, SendpulseSetVariableDataType } from './sendpulse.type';

@Injectable()
export class SendpulseSerializer {
  prepareMatchData(matchData: MatchDataType, flowId: string): SendpulseFlowRunDataType {
    return {
      contact_id: matchData.targetChatId,
      flow_id: flowId,
      external_data: {
        renter: matchData.matchedRenter,
        matchId: matchData.matchId,
      },
    };
  }

  prepareRunFlowData(chatId: string, flowId: string): SendpulseFlowRunDataType {
    return {
      contact_id: chatId,
      flow_id: flowId,
    };
  }

  prepareSetVariableData(matchData: MatchDataType, variableId: string): SendpulseSetVariableDataType {
    return {
      contact_id: matchData.targetChatId,
      variable_id: variableId,
      variable_value: matchData.matchId,
    };
  }
}
