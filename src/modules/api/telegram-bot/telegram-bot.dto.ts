import { IsString } from 'class-validator';
import { TelegramUserType, ApiTelegramUserCreateType } from './telegram-bot.types';

export class TelegramUserCreateDto implements ApiTelegramUserCreateType {
  @IsString()
  bot_id: string;

  @IsString()
  channel_id: string;

  @IsString()
  username: string;
}

export class TelegramChatIdDTO implements TelegramUserType {
  @IsString()
  chatId: string;
}
