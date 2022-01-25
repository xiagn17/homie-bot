import { Injectable } from '@nestjs/common';
import { Connection, EntityNotFoundError } from 'typeorm';
import { Payment } from '@a2seven/yoo-checkout';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { YoukassaPaymentsService } from '../../youkassa-payments/youkassa-payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { PaymentStatusInterface } from './interfaces/payment-status.interface';
import { PaymentItemInterface } from './interfaces/payment-item.interface';
import { PAYMENT_SUCCEEDED_EVENT_NAME, PaymentSucceededEvent } from './events/payment-succeeded.event';

@Injectable()
export class PaymentsService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,
    private eventEmitter: EventEmitter2,

    private youkassaPaymentsService: YoukassaPaymentsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getPaymentLink(chatId: string, item: PaymentItemInterface): Promise<string> {
    return this.connection.transaction(async entityManager => {
      const telegramUser = await entityManager
        .getCustomRepository(TelegramUsersRepository)
        .findOne({ chatId: chatId });
      if (!telegramUser) {
        throw new EntityNotFoundError(TelegramUserEntity, { chatId });
      }

      const payment = await this.youkassaPaymentsService.createPayment(item);
      const payLink = payment.confirmation.confirmation_url as string;

      await entityManager.getCustomRepository(PaymentsRepository).createAndSave({
        item: item,
        status: PaymentStatusInterface.pending,
        orderId: payment.id,
        telegramUserId: telegramUser.id,
      });

      return payLink;
    });
  }

  async handleSuccessPayment(payment: Payment): Promise<void> {
    await this.connection.transaction(async entityManager => {
      const paymentEntity = await entityManager
        .getCustomRepository(PaymentsRepository)
        .findOne({ orderId: payment.id });
      if (!paymentEntity) {
        throw new EntityNotFoundError(PaymentsRepository, { orderId: payment.id });
      }

      await this.eventEmitter.emitAsync(
        PAYMENT_SUCCEEDED_EVENT_NAME,
        new PaymentSucceededEvent({
          orderId: paymentEntity.orderId,
          telegramUserId: paymentEntity.telegramUserId,
          item: paymentEntity.item,
          entityManager: entityManager,
        }),
      );

      await entityManager
        .getCustomRepository(PaymentsRepository)
        .update({ orderId: payment.id }, { status: PaymentStatusInterface.succeeded });
    });
  }

  async handleCancelPayment(payment: Payment): Promise<void> {
    await this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(PaymentsRepository)
        .update({ orderId: payment.id }, { status: PaymentStatusInterface.canceled });
    });
  }
}
