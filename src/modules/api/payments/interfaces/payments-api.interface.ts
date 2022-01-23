import { TelegramUserType } from '../../telegram-bot/interfaces/telegram-bot.types';
import { PaymentItemInterface } from './payment-item.interface';

export interface ApiCreatePaymentInterface extends TelegramUserType {
  item: PaymentItemInterface;
}
