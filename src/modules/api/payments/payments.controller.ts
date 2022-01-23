import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { WebHookEvents } from '@a2seven/yoo-checkout';
import { WebhookPaymentEvent } from './interfaces/payments-youkassa.interface';
import { PaymentsWebhookGuard } from './guards/payments-webhook.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/CreatePayment.dto';

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

  @Post()
  async createPaymentLink(@Body() createPaymentDto: CreatePaymentDto): Promise<string> {
    return this.paymentsService.createPayment(createPaymentDto);
  }
}
