import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TelegramBotService } from './telegram-bot.service';

@Controller('bot')
export class TelegramBotController {
  constructor(private telegramBotService: TelegramBotService) {}

  @Get()
  async getRenters(): Promise<{ result: string }> {
    const renters = await this.telegramBotService.getRenters();
    return { result: renters.map(r => r.name).join(', ') };
  }

  @Post()
  getInfoWebhook(@Req() req: Request): void {
    console.log(req.body[0].contact);
  }
}
