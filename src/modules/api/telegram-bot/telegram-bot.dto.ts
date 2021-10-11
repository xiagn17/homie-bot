import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TelegramContactType, TelegramUserType, TelegramWebhookType } from './telegram-bot.types';

export class TelegramContactDTO implements TelegramContactType {
  @IsString()
  id: string;

  username: string | null;

  variables: any;

  last_message: string;

  name: string;

  photo: any;

  tags: string[];
}

export class TelegramWebhookDTO implements TelegramWebhookType {
  @ValidateNested()
  @Type(() => TelegramContactDTO)
  contact: TelegramContactDTO;

  bot: { url: string; external_id: number; id: string; name: string };

  date: number;

  info: any;

  service: 'telegram';

  title: 'renter_form' | 'unsubscribe';
}

export class TelegramChatIdDTO implements TelegramUserType {
  @IsString()
  chatId: string;
}
