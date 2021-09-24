import { Injectable } from '@nestjs/common';
import { TelegramUser } from '../../entities/users/TelegramUser';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Injectable()
export class TelegramBotSerializer {
  mapToDbData(newWebhookRenter: TelegramWebhookDTO): Partial<TelegramUser> {
    return {
      username: newWebhookRenter.contact.username,
      chatId: newWebhookRenter.contact.id,
    };
  }
}
