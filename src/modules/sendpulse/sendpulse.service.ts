import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { Renter } from '../../entities/users/Renter';
import { SendpulseRequests } from './sendpulse.requests';

@Injectable()
export class SendpulseService {
  constructor(private logger: Logger, private sendpulseRequests: SendpulseRequests) {
    this.logger.setContext(this.constructor.name);
  }

  async example(renter: Renter): Promise<void> {
    await this.sendpulseRequests.runFlowAtUser(
      renter.telegramUser.chatId,
      'eyJjIjoiNjE0Nzg2ZmZmMzg0Zjg2MDdmNzU1ZDg4In0',
    );
  }
}
