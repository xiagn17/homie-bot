import { Body, Controller, Post } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Controller('bot')
export class TelegramBotController {
  constructor(private telegramBotService: TelegramBotService) {}

  // todo backlog unsubscribe приходит через время, поэтому можно валидировать юзера на archived везде
  // и если что перенаправлять юзера на цепочку где будет попрошено переподписаться с разницей в 5 минут
  @Post('/webhook')
  async newUserWebhook(@Body() webhookDTOs: TelegramWebhookDTO[]): Promise<void> {
    const data = webhookDTOs[0];
    if (data.title === 'unsubscribe') {
      await this.telegramBotService.unsubscribeUser(data.contact.id);
      return;
    }
    await this.telegramBotService.subscribeUser(data);
  }
}
