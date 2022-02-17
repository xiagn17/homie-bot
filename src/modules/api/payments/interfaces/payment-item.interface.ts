export enum PaymentItems {
  '1-contacts' = '1-contacts',
  '5-contacts' = '5-contacts',
  'private-helper' = 'private-helper',
}

export type PaymentItemInterface = keyof typeof PaymentItems;
