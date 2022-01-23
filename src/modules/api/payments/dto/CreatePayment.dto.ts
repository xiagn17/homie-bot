import { IsString } from 'class-validator';
import { ApiCreatePaymentInterface } from '../interfaces/payments-api.interface';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';
import { PaymentItemInterface } from '../interfaces/payment-item.interface';

export class CreatePaymentDto extends TelegramChatIdDTO implements ApiCreatePaymentInterface {
  @IsString()
  item: PaymentItemInterface;
}
