import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { Renter } from '../../entities/users/Renter';

@Injectable()
export class TelegramBotService {
  constructor(private logger: Logger, private connection: Connection) {
    this.logger.setContext(this.constructor.name);
  }

  getRenters(): Promise<Renter[]> {
    return this.connection.getRepository(Renter).find();
  }
}
