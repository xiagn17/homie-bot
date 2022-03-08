import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUsersRepository } from './repositories/telegramUsers.repository';
import { TelegramUserEntity } from './entities/TelegramUser.entity';
import { TelegramBotSerializer } from './telegram-bot.serializer';
import { TelegramUserCreateDto } from './dto/telegram-bot.dto';

@Injectable()
export class TelegramBotService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,
    private telegramBotSerializer: TelegramBotSerializer,
    private configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async subscribeUser(newWebhookRenter: TelegramUserCreateDto): Promise<void> {
    const telegramUserDbData = this.telegramBotSerializer.mapToDbData(newWebhookRenter);
    const chatId = telegramUserDbData.chatId as string;
    const isUserExists = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOne({ chatId: chatId, botId: newWebhookRenter.bot_id });
    if (!isUserExists) {
      await this.entityManager.getCustomRepository(TelegramUsersRepository).createUser(telegramUserDbData);
      return;
    }

    this.logger.warn(`User with chatId = ${chatId} exists, undo archiving.`);
    await this.entityManager.getCustomRepository(TelegramUsersRepository).unArchiveUser(chatId);
  }

  public async unsubscribeUser(chatId: string): Promise<void> {
    await this.entityManager.getCustomRepository(TelegramUsersRepository).archiveUser(chatId);
  }

  public getAdmin(): Promise<TelegramUserEntity> {
    const adminUsername = this.configService.get('adminUsername');
    return this.entityManager.getCustomRepository(TelegramUsersRepository).findByUsername(adminUsername);
  }

  public getSubAdmin(): Promise<TelegramUserEntity> {
    const subAdminUsername = this.configService.get('subAdminUsername');
    return this.entityManager.getCustomRepository(TelegramUsersRepository).findByUsername(subAdminUsername);
  }

  public async isUserAdmin(chatId: string): Promise<boolean> {
    const { chatId: adminChatId } = await this.getAdmin();
    const { chatId: subAdminChatId } = await this.getSubAdmin();
    return adminChatId === chatId || subAdminChatId === chatId;
  }
}
