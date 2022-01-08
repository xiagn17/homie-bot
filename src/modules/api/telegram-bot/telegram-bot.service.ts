import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../logger/logger.service';
import { TelegramUsersRepository } from '../../../repositories/users/telegramUsers.repository';
import { AnalyticsService } from '../analytics/analytics.service';
import { RenterMatchesService } from '../renter-matches/renter-matches.service';
import { TelegramUserEntity } from '../../../entities/users/TelegramUser.entity';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramUserCreateDto } from './telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,
    private renterMatchesService: RenterMatchesService,
    private analyticsService: AnalyticsService,
    private configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async subscribeUser(newWebhookRenter: TelegramUserCreateDto): Promise<void> {
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter);
    const chatId = telegramUserDbData.chatId as string;
    const isUserExists = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOne({ chatId: chatId });
    if (!isUserExists) {
      const telegramUser = await this.entityManager
        .getCustomRepository(TelegramUsersRepository)
        .createUser(telegramUserDbData);
      await this.analyticsService.createForUser(telegramUser.id);
      return;
    }

    this.logger.warn(`User with chatId = ${chatId} exists, undo archiving.`);
    await this.entityManager.getCustomRepository(TelegramUsersRepository).unArchiveUser(chatId);
  }

  public async unsubscribeUser(chatId: string): Promise<void> {
    await this.entityManager.getCustomRepository(TelegramUsersRepository).archiveUser(chatId);
    await this.renterMatchesService.stopMatchingRenter(chatId);
  }

  public getAdmin(): Promise<TelegramUserEntity> {
    const adminUsername = this.configService.get('adminUsername');
    return this.entityManager.getCustomRepository(TelegramUsersRepository).findByUsername(adminUsername);
  }
}
