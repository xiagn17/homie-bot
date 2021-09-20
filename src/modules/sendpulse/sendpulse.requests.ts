import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request } from '../../utils/requests';
import { Logger } from '../logger/logger.service';
import {
  SendpulseAuthDataType,
  SendpulseAuthResponseType,
  SendpulseFlowRunDataType,
  SendpulseFlowRunResponseType,
} from './sendpulse.type';
import { SendpulseStore } from './sendpulse.store';

@Injectable()
export class SendpulseRequests {
  constructor(
    private logger: Logger,
    private configService: ConfigService,
    private readonly sendpulseStore: SendpulseStore,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async runFlowAtUser(chatId: string, flowId: string): Promise<void> {
    try {
      const response = await request<SendpulseFlowRunDataType, SendpulseFlowRunResponseType>(
        '/flows/run',
        'https://api.sendpulse.com/telegram',
        'POST',
        {},
        {
          Authorization: await this.getAuthToken(),
        },
        {
          contact_id: chatId,
          flow_id: flowId,
          external_data: {},
        },
      );
      if (response.success) {
        this.logger.log(`Flow is executed at user ${chatId}`);
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async auth(): Promise<SendpulseAuthResponseType> {
    try {
      const response = await request<SendpulseAuthDataType, SendpulseAuthResponseType>(
        '/oauth/access_token',
        'https://api.sendpulse.com',
        'POST',
        {},
        {},
        {
          grant_type: 'client_credentials',
          client_id: this.configService.get('sendpulse.clientId') as string,
          client_secret: this.configService.get('sendpulse.clientSecret') as string,
        },
      );

      return response;
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const token = this.sendpulseStore.getFullToken();
    if (token) {
      return token;
    }
    const data = await this.auth();
    return this.sendpulseStore.setToken(data.access_token, data.token_type, data.expires_in);
  }
}
