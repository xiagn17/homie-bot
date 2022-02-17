import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  PAYMENT_SUCCEEDED_EVENT_NAME,
  PaymentSucceededEvent,
} from '../../payments/events/payment-succeeded.event';
import { RentersService } from '../renters.service';
import { PaymentItems } from '../../payments/interfaces/payment-item.interface';

@Injectable()
export class PaymentSucceededListener {
  constructor(private rentersService: RentersService) {}

  @OnEvent(PAYMENT_SUCCEEDED_EVENT_NAME)
  async handlePaymentSucceededEvent(data: PaymentSucceededEvent): Promise<void> {
    if (data.item === PaymentItems['5-contacts'] || data.item === PaymentItems['1-contacts']) {
      const countContacts = data.item === PaymentItems['5-contacts'] ? 5 : 1;
      await this.rentersService.addPaidContacts(data.telegramUserId, countContacts, data.entityManager);
      return;
    }
    if (data.item === PaymentItems['private-helper']) {
      await this.rentersService.addPrivateHelper(data.telegramUserId, data.entityManager);
      return;
    }
  }
}
