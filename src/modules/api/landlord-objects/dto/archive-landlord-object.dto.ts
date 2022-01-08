import { ApiLandlordObjectArchiveType } from '../landlord-objects.type';
import { TelegramChatIdDTO } from '../../telegram-bot/telegram-bot.dto';

export class ArchiveLandlordObjectDto extends TelegramChatIdDTO implements ApiLandlordObjectArchiveType {}
