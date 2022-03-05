import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

interface BroadcastModerationToAdminInterface {
  object: ApiObjectResponse;
  chatId: string;
}
export class BroadcastModerationToAdminEvent implements BroadcastModerationToAdminInterface {
  object: ApiObjectResponse;

  chatId: string;

  constructor(data: BroadcastModerationToAdminInterface) {
    this.object = data.object;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_MODERATION_TO_ADMIN_EVENT_NAME = 'broadcast.moderation.admin';
