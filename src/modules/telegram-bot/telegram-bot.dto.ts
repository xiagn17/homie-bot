import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiTelegramUnsubscribeType,
  TelegramContactType,
  TelegramUserType,
  TelegramWebhookType,
} from './telegram-bot.types';

export class TelegramContactDTO implements TelegramContactType {
  @IsString()
  id: string;

  @IsString()
  username: string;

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

  title: 'renter_form';
}

export class TelegramChatIdDTO implements TelegramUserType {
  @IsString()
  chatId: string;
}

export class TelegramUnsubscribeDTO implements ApiTelegramUnsubscribeType {
  @IsString()
  chatId: string;
}
