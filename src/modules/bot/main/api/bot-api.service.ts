import { Injectable } from '@nestjs/common';
import { TelegramBotService } from '../../../api/telegram-bot/telegram-bot.service';

// todo нужен тут type или нет?
export interface CreateTelegramUserInterface {
  bot_id: string;
  channel_id: string;
  username: string | null;
}
@Injectable()
export class BotApiService {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  async create(data: CreateTelegramUserInterface): Promise<void> {
    await this.telegramBotService.subscribeUser(data);
  }
}
