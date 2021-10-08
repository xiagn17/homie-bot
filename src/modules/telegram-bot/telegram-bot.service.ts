import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';
import { RentersService } from '../renters/renters.service';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,
    private rentersService: RentersService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async subscribeUser(newWebhookRenter: TelegramWebhookDTO): Promise<void> {
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter);
    const chatId = telegramUserDbData.chatId as string;
    const isUserExists = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOne({ chatId: chatId });
    if (!isUserExists) {
      await this.entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);
      return;
    }

    this.logger.warn(`User with chatId = ${chatId} exists, undo archiving.`);

    const telegramUser = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findByChatIdWithRenter(chatId);
    if (!telegramUser.renter) {
      return;
    }

    await this.rentersService.unArchiveRenter(telegramUser.renter.id);
  }

  async unsubscribeUser(chatId: string): Promise<void> {
    const telegramUser = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findByChatIdWithRenter(chatId);
    if (!telegramUser.renter) {
      return;
    }

    await this.rentersService.archiveRenter(chatId, telegramUser.renter.id);
  }
}
