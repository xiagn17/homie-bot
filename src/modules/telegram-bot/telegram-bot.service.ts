import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: Logger,
    private connection: Connection,
    private telegramBotSerializer: TelegramBotSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async addNewTelegramRenter(newWebhookRenter: TelegramWebhookDTO): Promise<void> {
    const telegramUser = this.telegramBotSerializer.deserialize(newWebhookRenter);
    await this.connection.getCustomRepository(TelegramUsersRepository).createUser(telegramUser);
  }
}
