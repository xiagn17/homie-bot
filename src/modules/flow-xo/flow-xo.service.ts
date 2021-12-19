import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MatchDataType } from '../api/renter-matches/renter-matches.type';
import { FlowXoRequests } from './flow-xo.requests';
import { FlowXoSerializer } from './flow-xo.serializer';

const FLOW_URLS = {
  sendMatch: '/hooks/a/2mjzknbz', // existing or new one
  buyMatches: '/hooks/a/eaajwkyy',
};

@Injectable()
export class FlowXoService {
  constructor(
    private logger: Logger,
    private flowXoRequests: FlowXoRequests,
    private flowXoSerializer: FlowXoSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async sendMessageWithMatch(matchData: MatchDataType, isExistingMatch: boolean): Promise<void> {
    const flowData = this.flowXoSerializer.prepareMatchData(matchData, isExistingMatch);
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.sendMatch);
  }

  public async sendRenterToMatchPayment(chatId: string, botId: string): Promise<void> {
    const flowData = this.flowXoSerializer.preparePayMatchData(chatId, botId);
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.buyMatches);
  }
}
