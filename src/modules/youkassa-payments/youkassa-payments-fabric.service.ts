import { Injectable } from '@nestjs/common';
import { ICreatePayment } from '@a2seven/yoo-checkout';
import { IAmount } from '@a2seven/yoo-checkout/lib/types';
import { ConfigService } from '@nestjs/config';
import { PaymentItemInterface, PaymentItems } from '../api/payments/interfaces/payment-item.interface';
import { PaymentsPricesConfigType } from '../configuration/interfaces/configuration.types';

@Injectable()
export class YoukassaPaymentsFabricService {
  private readonly prices: PaymentsPricesConfigType;

  constructor(private configService: ConfigService) {
    this.prices = this.configService.get('payments.prices') as PaymentsPricesConfigType;
  }

  createPaymentPayload(item: PaymentItemInterface): ICreatePayment {
    return {
      amount: this.getAmountByItem(item),
      description: this.getDescriptionByItem(item),
      ...this.getDefaultPaymentOptions(),
    };
  }

  private getDescriptionByItem(item: PaymentItemInterface): string {
    if (item === PaymentItems['subscription-2-weeks']) {
      return 'Две недели подписки Homie';
    } else if (item === PaymentItems['subscription-month']) {
      return 'Месяц подписки Homie';
    } else if (item === PaymentItems['subscription-1-week']) {
      return 'Неделя подписки Homie';
    } else {
      return 'Покупка';
    }
  }

  private getAmountByItem(item: PaymentItemInterface): IAmount {
    const amount: Partial<IAmount> = {
      currency: 'RUB',
    };
    if (item === PaymentItems['subscription-month']) {
      amount.value = this.prices.subscriptionMonth;
    } else if (item === PaymentItems['subscription-2-weeks']) {
      amount.value = this.prices.subscriptionTwoWeeks;
    } else if (item === PaymentItems['subscription-1-week']) {
      amount.value = this.prices.subscriptionOneWeek;
    }
    const postfix = '.00';
    amount.value += postfix;

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
