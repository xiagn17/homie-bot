import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

interface BroadcastRenewObjectInterface {
  object: ApiObjectResponse;
  chatId: string;
}
export class BroadcastRenewObjectEvent implements BroadcastRenewObjectInterface {
  object: ApiObjectResponse;

  chatId: string;

  constructor(data: BroadcastRenewObjectInterface) {
    this.object = data.object;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_RENEW_OBJECT_EVENT_NAME = 'broadcast.renewObject';
