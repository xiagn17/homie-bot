import { Injectable, OnModuleInit } from '@nestjs/common';
import { Payment, YooCheckout } from '@a2seven/yoo-checkout';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { PaymentsConfigType } from '../configuration/interfaces/configuration.types';
import { LoggerService } from '../logger/logger.service';
import { PaymentItemInterface } from '../api/payments/interfaces/payment-item.interface';
import { YoukassaPaymentsFabricService } from './youkassa-payments-fabric.service';
@Injectable()
export class YoukassaPaymentsService implements OnModuleInit {
  private paymentsConfig: PaymentsConfigType;

  private yooCheckout: YooCheckout;

  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private youkassaPaymentsFabricService: YoukassaPaymentsFabricService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit(): void {
    this.paymentsConfig = this.configService.get('payments') as PaymentsConfigType;
    this.yooCheckout = new YooCheckout({
      shopId: this.paymentsConfig.shopId,
      secretKey: this.paymentsConfig.secretKey,
    });
  }

  async createPayment(item: PaymentItemInterface): Promise<Payment> {
    const idempotenceKeyId = uuidV4();
    const createPaymentPayload = this.youkassaPaymentsFabricService.createPaymentPayload(item);
    return this.yooCheckout.createPayment(createPaymentPayload, idempotenceKeyId);
  }
}
