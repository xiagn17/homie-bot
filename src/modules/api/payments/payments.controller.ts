import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { WebHookEvents } from '@a2seven/yoo-checkout';
import { WebhookPaymentEvent } from './interfaces/payments-youkassa.interface';
import { PaymentsWebhookGuard } from './guards/payments-webhook.guard';
import { PaymentsService } from './payments.service';
import { PaymentItemInterface } from './interfaces/payment-item.interface';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('/webhook')
  @UseGuards(PaymentsWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async getUpdates(@Body() paymentEvent: WebhookPaymentEvent): Promise<void> {
    if (paymentEvent.event === WebHookEvents['payment.succeeded']) {
      await this.paymentsService.handleSuccessPayment(paymentEvent.object);
    } else if (paymentEvent.event === WebHookEvents['payment.canceled']) {
      await this.paymentsService.handleCancelPayment(paymentEvent.object);
    }
  }

  @Get('/:chatId/:item')
  async getPaymentLink(
    @Param('chatId') chatId: string,
    @Param('item') item: PaymentItemInterface,
    @Response() response: ResponseType,
  ): Promise<void> {
    const paymentUrl = await this.paymentsService.getPaymentLink(chatId, item);
    response.redirect(paymentUrl);
  }
}
