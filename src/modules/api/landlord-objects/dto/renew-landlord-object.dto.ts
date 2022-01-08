import { TelegramChatIdDTO } from '../../telegram-bot/telegram-bot.dto';
import { ApiLandlordObjectRenewType } from '../landlord-objects.type';

export class RenewLandlordObjectDto extends TelegramChatIdDTO implements ApiLandlordObjectRenewType {}
