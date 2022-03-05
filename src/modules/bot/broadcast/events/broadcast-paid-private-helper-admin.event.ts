interface BroadcastPaidPrivateHelperToAdminInterface {
  username: string | null;
  chatId: string;
}
export class BroadcastPaidPrivateHelperToAdminEvent implements BroadcastPaidPrivateHelperToAdminInterface {
  username: string | null;

  chatId: string;

  constructor(data: BroadcastPaidPrivateHelperToAdminInterface) {
    this.username = data.username;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_PAID_PRIVATE_HELPER_TO_ADMIN_EVENT_NAME = 'broadcast.privateHelper.admin';
