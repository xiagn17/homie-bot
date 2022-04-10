import { InlineKeyboardMarkup } from '@grammyjs/types/inline';

interface BroadcastSendMessageTaskInterface {
  message: string;
  chatId: string;
  markup?: InlineKeyboardMarkup;
}
export class BroadcastSendMessageTaskEvent implements BroadcastSendMessageTaskInterface {
  message: string;

  chatId: string;

  markup?: InlineKeyboardMarkup;

  constructor(data: BroadcastSendMessageTaskInterface) {
    this.message = data.message;
    this.chatId = data.chatId;
    this.markup = data.markup;
  }
}

export const BROADCAST_SEND_MESSAGE_TASK_EVENT_NAME = 'broadcast.sendMessage.user';
