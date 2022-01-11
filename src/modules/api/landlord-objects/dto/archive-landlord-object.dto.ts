import { ApiLandlordObjectArchiveType } from '../interfaces/landlord-objects.type';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';

export class ArchiveLandlordObjectDto extends TelegramChatIdDTO implements ApiLandlordObjectArchiveType {}
