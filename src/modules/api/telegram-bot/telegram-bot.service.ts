import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { sendAnalyticsStartChatEvent } from '../../../utils/google-analytics/sendAnalyticsEvent';
import { parseReferralChatIdFromLink } from '../../bot/helpers/referralLink/parseReferralLink';
import { TelegramUsersRepository } from './repositories/telegramUsers.repository';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramUserCreateDto } from './dto/telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async subscribeUser(newWebhookRenter: TelegramUserCreateDto): Promise<void> {
    const chatId = newWebhookRenter.channel_id;
    const isUserExists = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOne({ chatId: chatId, botId: newWebhookRenter.bot_id });
    if (isUserExists) {
      this.logger.warn(`User with chatId = ${chatId} exists, undo archiving.`);
      await this.entityManager.getCustomRepository(TelegramUsersRepository).unArchiveUser(chatId);
      return;
    }

    sendAnalyticsStartChatEvent(chatId, newWebhookRenter.deepLink);
    const referralUserChatId = parseReferralChatIdFromLink(newWebhookRenter.deepLink);
    await this.entityManager.transaction(async entityManager => {
      const referralUser = referralUserChatId
        ? await entityManager
            .getCustomRepository(TelegramUsersRepository)
            .findOne({ chatId: referralUserChatId })
        : undefined;
      const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter, referralUser?.id);
      await entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);
    });
  }

  public async unsubscribeUser(chatId: string): Promise<void> {
    await this.entityManager.getCustomRepository(TelegramUsersRepository).archiveUser(chatId);
  }

  public async getUsersCount(): Promise<number> {
    return this.entityManager.getCustomRepository(TelegramUsersRepository).getUsersCount();
  }
}
