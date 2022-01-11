import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';
import { ApiLandlordObjectRenewType } from '../interfaces/landlord-objects.type';

export class RenewLandlordObjectDto extends TelegramChatIdDTO implements ApiLandlordObjectRenewType {}
