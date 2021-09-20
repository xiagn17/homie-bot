import { Body, Controller, Post } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramWebhookDTO } from './telegram-bot.dto';

@Controller('bot')
export class TelegramBotController {
  constructor(private telegramBotService: TelegramBotService) {}

  @Post('/webhook')
  async newUserWebhook(@Body() webhookDTOs: TelegramWebhookDTO[]): Promise<void> {
    await this.telegramBotService.addNewTelegramRenter(webhookDTOs[0]);
  }
}
