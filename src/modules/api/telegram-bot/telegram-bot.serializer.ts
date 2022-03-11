import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from './entities/TelegramUser.entity';
import { TelegramUserCreateDto } from './dto/telegram-bot.dto';

@Injectable()
export class TelegramBotSerializer {
  mapToDbData(telegramUserCreateDto: TelegramUserCreateDto): Partial<TelegramUserEntity> {
    return {
      username: telegramUserCreateDto.username,
      chatId: telegramUserCreateDto.channel_id,
      botId: telegramUserCreateDto.bot_id,
      deepLink: telegramUserCreateDto.deepLink,
    };
  }
}
