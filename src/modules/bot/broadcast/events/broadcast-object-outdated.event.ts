import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

interface BroadcastObjectOutdatedPushInterface {
  object: ApiObjectResponse;
  chatId: string;
}
export class BroadcastObjectOutdatedPushEvent implements BroadcastObjectOutdatedPushInterface {
  object: ApiObjectResponse;

  chatId: string;

  constructor(data: BroadcastObjectOutdatedPushInterface) {
    this.object = data.object;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_OBJECT_OUTDATED_TO_LANDLORD_EVENT_NAME = 'broadcast.objectOutdated.landlord';
