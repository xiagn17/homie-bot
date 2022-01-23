import { Payment } from '@a2seven/yoo-checkout';
import { WebHookEvents } from '@a2seven/yoo-checkout/lib/core/constants';

export interface WebhookPaymentEvent {
  type: 'notification';
  event: WebHookEvents;
  object: Payment;
}
