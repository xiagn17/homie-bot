interface BroadcastPaidContactsToBuyerInterface {
  contactsNumber: number;
  chatId: string;
}
export class BroadcastPaidContactsToBuyerEvent implements BroadcastPaidContactsToBuyerInterface {
  contactsNumber: number;

  chatId: string;

  constructor(data: BroadcastPaidContactsToBuyerInterface) {
    this.contactsNumber = data.contactsNumber;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_PAID_CONTACTS_TO_BUYER_EVENT_NAME = 'broadcast.paidContacts.buyer';
