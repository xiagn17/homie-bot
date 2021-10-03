import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request } from '../../utils/requests';
import { Logger } from '../logger/logger.service';
import {
  SendpulseAuthDataType,
  SendpulseAuthResponseType,
  SendpulseFlowRunDataType,
  SendpulseDefaultResponseType,
  SendpulseSetVariableDataType,
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

  public async runFlowAtUser(data: SendpulseFlowRunDataType): Promise<void> {
    await this.baseRequestMethod<SendpulseFlowRunDataType, SendpulseDefaultResponseType>(data, {
      endpoint: '/flows/run',
      method: 'POST',
      messageOnSuccess: `Flow is executed at user ${data.contact_id}`,
    });
  }

  public async setVariableAtUser(data: SendpulseSetVariableDataType): Promise<void> {
    await this.baseRequestMethod<SendpulseSetVariableDataType, SendpulseDefaultResponseType>(data, {
      endpoint: '/contacts/setVariable',
      method: 'POST',
      messageOnSuccess: `Variable set at user ${data.contact_id}`,
    });
  }

  private async baseRequestMethod<ReqT, ResT extends SendpulseDefaultResponseType>(
    data: ReqT,
    options: { endpoint: string; messageOnSuccess: string; method: 'POST' | 'GET' },
  ): Promise<ResT> {
    try {
      const response = await request<ReqT, ResT>(
        options.endpoint,
        'https://api.sendpulse.com/telegram',
        options.method,
        {},
        {
          Authorization: await this.getAuthToken(),
        },
        data,
      );
      if (response.success) {
        this.logger.log(options.messageOnSuccess);
      }
      return response;
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
