import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async addNewTelegramRenter(newWebhookRenter: TelegramWebhookDTO): Promise<void> {
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter);
    await this.entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);
  }
}
