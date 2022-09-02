export enum PaymentItems {
  'subscription-2-weeks' = 'subscription-2-weeks',
  'subscription-1-week' = 'subscription-1-week',
  'subscription-month' = 'subscription-month',
}

export type PaymentItemInterface = keyof typeof PaymentItems;
