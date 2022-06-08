interface BroadcastSubscriptionStartInterface {
  endsAt: Date;
  chatId: string;
}
export class BroadcastSubscriptionStartEvent implements BroadcastSubscriptionStartInterface {
  endsAt: Date;

  chatId: string;

  constructor(data: BroadcastSubscriptionStartInterface) {
    this.endsAt = data.endsAt;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_SUBSCRIPTION_START_EVENT_NAME = 'broadcast.subscriptionStart';
