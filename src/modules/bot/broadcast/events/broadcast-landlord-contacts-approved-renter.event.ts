import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';

interface BroadcastLandlordContactsToApprovedRenterInterface {
  object: LandlordObjectEntity;
  chatId: string;
}
export class BroadcastLandlordContactsToApprovedRenterEvent
  implements BroadcastLandlordContactsToApprovedRenterInterface
{
  object: LandlordObjectEntity;

  chatId: string;

  constructor(data: BroadcastLandlordContactsToApprovedRenterInterface) {
    this.object = data.object;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_LANDLORD_CONTACTS_TO_APPROVED_RENTER_EVENT_NAME =
  'broadcast.landlordContacts.approvedRenter';
