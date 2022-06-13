import { EntityManager } from 'typeorm';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

interface BroadcastNewObjectToRenterPushInterface {
  object: ApiObjectResponse;
  chatId: string;
  entityManager: EntityManager;
}
export class BroadcastNewObjectToRenterPushEvent implements BroadcastNewObjectToRenterPushInterface {
  object: ApiObjectResponse;

  chatId: string;

  entityManager: EntityManager;

  constructor(data: BroadcastNewObjectToRenterPushInterface) {
    this.object = data.object;
    this.chatId = data.chatId;
    this.entityManager = data.entityManager;
  }
}

export const BROADCAST_NEW_OBJECT_TO_RENTER_EVENT_NAME = 'broadcast.newObject.renter';
