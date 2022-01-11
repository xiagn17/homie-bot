import { Injectable } from '@nestjs/common';
import { request } from '../../utils/requests';
import { LoggerService } from '../logger/logger.service';
import { FlowXoFlowRunDataType, FlowXoDefaultResponseType } from './interfaces/flow-xo.type';

@Injectable()
export class FlowXoRequests {
  constructor(private logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  public async runFlowAtUser(data: FlowXoFlowRunDataType, flowUrl: string): Promise<void> {
    await this.baseRequestMethod<FlowXoFlowRunDataType, FlowXoDefaultResponseType>(data, {
      endpoint: flowUrl,
      method: 'POST',
      messageOnSuccess: `Flow is executed at user ${data.chat_id}`,
    });
  }

  private async baseRequestMethod<ReqT, ResT extends FlowXoDefaultResponseType>(
    data: ReqT,
    options: { endpoint: string; messageOnSuccess: string; method: 'POST' | 'GET' },
  ): Promise<ResT> {
    try {
      const response = await request<ReqT, ResT>(
        options.endpoint,
        'https://flowxo.com',
        options.method,
        {},
        {},
        data,
      );
      if (response.msg === 'success') {
        this.logger.info(options.messageOnSuccess);
      }
      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
