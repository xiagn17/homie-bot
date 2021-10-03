import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';
import { RenterMatchesService } from '../renter-matches/renter-matches.service';
import { Renter } from '../../entities/users/Renter';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramUnsubscribeDTO, TelegramWebhookDTO } from './telegram-bot.dto';

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

  async subscribeUser(newWebhookRenter: TelegramWebhookDTO): Promise<void> {
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter);
    try {
      await this.entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);
    } catch (e) {
      this.logger.error(e);
      const telegramUser = await this.entityManager
        .getCustomRepository(TelegramUsersRepository)
        .getUserByChatId(telegramUserDbData.chatId as string);
      await this.entityManager.getRepository(Renter).save({
        id: telegramUser.renter.id,
        archivedAt: null,
      });
    }
  }

  async unsubscribeUser(unsubscribeDTO: TelegramUnsubscribeDTO): Promise<void> {
    const telegramUser = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .getUserByChatId(unsubscribeDTO.chatId);

    await this.entityManager.getRepository(Renter).save({
      id: telegramUser.renter.id,
      archivedAt: Date.now(),
    });
    await this.renterMatchesService.stopMatchingRenter(telegramUser.renter.id);
  }
}
