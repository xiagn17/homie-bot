import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { MyContext } from '../interfaces/bot.interface';

@Injectable()
export class BotInstanceService {
  public bot: Bot<MyContext>;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get('bot.token');
    this.bot = new Bot<MyContext>(token);
  }
}
