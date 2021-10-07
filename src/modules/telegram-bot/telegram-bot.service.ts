import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';
import { RenterMatchesService } from '../renter-matches/renter-matches.service';
import { Renter } from '../../entities/users/Renter';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,
    private renterMatchesService: RenterMatchesService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  // todo учесть что username-а может и не быть! (очень редкий кейс)
  async subscribeUser(newWebhookRenter: TelegramWebhookDTO): Promise<void> {
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter);
    const isUserExists = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOne({ chatId: telegramUserDbData.chatId as string });
    if (!isUserExists) {
      await this.entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);
      return;
    }

    this.logger.error(`User exists, undo archiving.`);

    const telegramUser = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .getUserByChatId(telegramUserDbData.chatId as string);
    await this.entityManager.getRepository(Renter).save({
      id: telegramUser.renter.id,
      archivedAt: null,
    });
  }

  async unsubscribeUser(chatId: string): Promise<void> {
    const telegramUser = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .getUserByChatId(chatId);

    await this.entityManager.getRepository(Renter).save({
      id: telegramUser.renter.id,
      archivedAt: new Date(),
    });
    await this.renterMatchesService.stopMatchingRenter(chatId);
  }
}
