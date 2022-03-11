import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TelegramUserType, ApiTelegramUserCreateType } from '../interfaces/telegram-bot.types';

const transformStringToNullIfEmpty = (value: string): string | null => (value === '' ? null : value);

export class TelegramUserCreateDto implements ApiTelegramUserCreateType {
  @IsString()
  bot_id: string;

  @IsString()
  channel_id: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => transformStringToNullIfEmpty(value), { toClassOnly: true })
  username: string | null;

  deepLink: string | null;
}

export class TelegramChatIdDTO implements TelegramUserType {
  @IsString()
  chatId: string;
}
