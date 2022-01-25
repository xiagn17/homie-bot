import { EntityManager } from 'typeorm';
import { PaymentItemInterface } from '../interfaces/payment-item.interface';

interface PaymentSucceededInterface {
  orderId: string;
  item: PaymentItemInterface;
  telegramUserId: string;
  entityManager: EntityManager;
}
export class PaymentSucceededEvent implements PaymentSucceededInterface {
  orderId: string;

  item: PaymentItemInterface;

  telegramUserId: string;

  entityManager: EntityManager;

  constructor(data: PaymentSucceededInterface) {
    this.orderId = data.orderId;
    this.item = data.item;
    this.telegramUserId = data.telegramUserId;
    this.entityManager = data.entityManager;
  }
}

export const PAYMENT_SUCCEEDED_EVENT_NAME = 'payment.success';
