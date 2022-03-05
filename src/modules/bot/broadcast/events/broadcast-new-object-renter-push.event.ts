import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

interface BroadcastNewObjectToRenterPushInterface {
  object: ApiObjectResponse;
  chatId: string;
}
export class BroadcastNewObjectToRenterPushEvent implements BroadcastNewObjectToRenterPushInterface {
  object: ApiObjectResponse;

  chatId: string;

  constructor(data: BroadcastNewObjectToRenterPushInterface) {
    this.object = data.object;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_NEW_OBJECT_TO_RENTER_EVENT_NAME = 'broadcast.newObject.renter';
