export interface TelegramWebhookType {
  info: any;
  service: 'telegram';
  title: 'renter_form';
  bot: {
    url: string;
    external_id: number;
    id: string;
    name: string;
  };
  contact: TelegramContactType;
  date: number; // timestamp
}
export interface TelegramContactType {
  username: string; // tg username
  name: string; // tg name
  tags: string[]; // sendpulse tags
  last_message: string;
  photo: any;
  variables: any; // variables from sendpulse
  id: string; // sendpulse id
}
