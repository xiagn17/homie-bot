interface BroadcastPaidPrivateHelperToBuyerInterface {
  chatId: string;
}
export class BroadcastPaidPrivateHelperToBuyerEvent implements BroadcastPaidPrivateHelperToBuyerInterface {
  chatId: string;

  constructor(data: BroadcastPaidPrivateHelperToBuyerInterface) {
    this.chatId = data.chatId;
  }
}

export const BROADCAST_PAID_PRIVATE_HELPER_TO_BUYER_EVENT_NAME = 'broadcast.privateHelper.buyer';
