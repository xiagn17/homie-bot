import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramBotService } from '../../../api/telegram-bot/telegram-bot.service';

export interface CreateTelegramUserInterface {
  channel_id: string;
  username: string | null;
  deepLink: string | null;
}
@Injectable()
export class BotApiService {
  constructor(
    private readonly telegramBotService: TelegramBotService,
    private configService: ConfigService,
  ) {}

  async create(data: CreateTelegramUserInterface): Promise<void> {
    const botId = this.configService.get('bot.id') as string;
    await this.telegramBotService.subscribeUser({ ...data, bot_id: botId });
  }

  async getUsersCount(): Promise<number> {
    return this.telegramBotService.getUsersCount();
  }
}
