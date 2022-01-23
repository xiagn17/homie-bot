import { Injectable } from '@nestjs/common';
import { Connection, EntityNotFoundError } from 'typeorm';
import { Payment } from '@a2seven/yoo-checkout';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { YoukassaPaymentsService } from '../../youkassa-payments/youkassa-payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { PaymentStatusInterface } from './interfaces/payment-status.interface';
import { CreatePaymentDto } from './dto/CreatePayment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private youkassaPaymentsService: YoukassaPaymentsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<string> {
    const paymentLink = await this.connection.transaction(async entityManager => {
      const telegramUser = await entityManager
        .getCustomRepository(TelegramUsersRepository)
        .findOne({ chatId: createPaymentDto.chatId });
      if (!telegramUser) {
        throw new EntityNotFoundError(TelegramUserEntity, { chatId: createPaymentDto.chatId });
      }

      const payment = await this.youkassaPaymentsService.createPayment(createPaymentDto.item);
      const payLink = payment.confirmation.confirmation_url as string;

      await entityManager.getCustomRepository(PaymentsRepository).createAndSave({
        item: createPaymentDto.item,
        status: PaymentStatusInterface.pending,
        orderId: payment.id,
        telegramUserId: telegramUser.id,
      });

      return payLink;
    });
    return paymentLink;
  }

  async handleSuccessPayment(payment: Payment): Promise<void> {
    await this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(PaymentsRepository)
        .update({ orderId: payment.id }, { status: PaymentStatusInterface.succeeded });
      // и тут по типу делаем .emit('', type)
    });
  }

  async handleCancelPayment(payment: Payment): Promise<void> {
    await this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(PaymentsRepository)
        .update({ orderId: payment.id }, { status: PaymentStatusInterface.canceled });
      // и тут по типу делаем .emit('', type)
    });
  }
}
