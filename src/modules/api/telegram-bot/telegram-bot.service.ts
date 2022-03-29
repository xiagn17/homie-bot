import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { sendAnalyticsStartChatEvent } from '../../../utils/google-analytics/sendAnalyticsEvent';
import { parseReferralChatIdFromLink } from '../../bot/helpers/referralLink/parseReferralLink';
import { RentersService } from '../renters/renters.service';
import { RenterReferralsEnum } from '../renters/interfaces/renter-referrals.interface';
import { TelegramUsersRepository } from './repositories/telegramUsers.repository';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramUserCreateDto } from './dto/telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,

    private readonly rentersService: RentersService,
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
    const referralUser = referralUserChatId
      ? await this.entityManager
          .getCustomRepository(TelegramUsersRepository)
          .findOne({ chatId: referralUserChatId })
      : undefined;
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter, referralUser?.id);
    await this.entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);

    if (referralUser) {
      await this.rentersService.depositReferralContacts(referralUser.id, RenterReferralsEnum.onStart);
    }
  }

  public async unsubscribeUser(chatId: string): Promise<void> {
    await this.entityManager.getCustomRepository(TelegramUsersRepository).archiveUser(chatId);
  }

  public async getUsersCount(): Promise<number> {
    return this.entityManager.getCustomRepository(TelegramUsersRepository).getUsersCount();
  }
}
