import { Injectable } from '@nestjs/common';
import { ICreatePayment } from '@a2seven/yoo-checkout';
import { IAmount } from '@a2seven/yoo-checkout/lib/types';
import { PaymentItemInterface, PaymentItems } from '../api/payments/interfaces/payment-item.interface';

@Injectable()
export class YoukassaPaymentsFabricService {
  createPaymentPayload(item: PaymentItemInterface): ICreatePayment {
    return {
      amount: this.getAmountByItem(item),
      description: this.getDescriptionByItem(item),
      ...this.getDefaultPaymentOptions(),
    };
  }

  private getDescriptionByItem(item: PaymentItemInterface): string {
    if (item === PaymentItems['5-contacts']) {
      return 'Покупка 5-ти контактов';
    } else {
      return 'Покупка 1-го контакта';
    }
  }

  private getAmountByItem(item: PaymentItemInterface): IAmount {
    const amount: Partial<IAmount> = {
      currency: 'RUB',
    };
    if (item === PaymentItems['5-contacts']) {
      amount.value = '299.00';
    } else {
      amount.value = '99.00';
    }
    return amount as IAmount;
  }

  private getDefaultPaymentOptions(): Partial<ICreatePayment> {
    return {
      capture: 'true',
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://t.me/Homie_robot',
        locale: 'ru_RU',
      },
    };
  }
}
