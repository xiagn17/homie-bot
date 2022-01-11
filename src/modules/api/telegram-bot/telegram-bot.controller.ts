import { Body, Controller, Post } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramUserCreateDto } from './dto/telegram-bot.dto';

@Controller('bot')
export class TelegramBotController {
  constructor(private telegramBotService: TelegramBotService) {}

  @Post('/create')
  async createNewUser(@Body() data: TelegramUserCreateDto): Promise<void> {
    await this.telegramBotService.subscribeUser(data);
  }
}
