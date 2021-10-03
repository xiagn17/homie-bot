import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MatchDataType } from '../renter-matches/renter-matches.type';
import { SendpulseRequests } from './sendpulse.requests';
import { SendpulseSerializer } from './sendpulse.serializer';

const CHAIN_IDS = {
  sendMatch: '614e32f90a04025f78354734',
  sendExistingMatch: '61587a99beefa4547b083437',
  buyMatches: '615366c14569c64414655657',
};
const VARIABLE_IDS = {
  lastMatchId: '61538f07a24aae1bb6141064',
};

@Injectable()
export class SendpulseService {
  constructor(
    private logger: Logger,
    private sendpulseRequests: SendpulseRequests,
    private sendpulseSerializer: SendpulseSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async sendMessageWithMatch(matchData: MatchDataType, isExistingMatch: boolean): Promise<void> {
    const chainId = isExistingMatch ? CHAIN_IDS.sendExistingMatch : CHAIN_IDS.sendMatch;
    const serializedMatchData = this.sendpulseSerializer.prepareMatchData(matchData, chainId);
    const serializedVariableData = this.sendpulseSerializer.prepareSetVariableData(
      matchData,
      VARIABLE_IDS.lastMatchId,
    );
    await this.sendpulseRequests.runFlowAtUser(serializedMatchData);
    await this.sendpulseRequests.setVariableAtUser(serializedVariableData);
  }

  async sendRenterToMatchPayment(chatId: string): Promise<void> {
    const serializedMatchData = this.sendpulseSerializer.prepareRunFlowData(chatId, CHAIN_IDS.buyMatches);
    await this.sendpulseRequests.runFlowAtUser(serializedMatchData);
  }
}
