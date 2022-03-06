import { ApiRenterFullInfo } from '../../../api/renters/interfaces/renter-info.interface';

interface BroadcastInterestedRenterToLandlordInterface {
  renterInfo: ApiRenterFullInfo;
  chatId: string;
}
export class BroadcastInterestedRenterToLandlordEvent
  implements BroadcastInterestedRenterToLandlordInterface
{
  renterInfo: ApiRenterFullInfo;

  chatId: string;

  constructor(data: BroadcastInterestedRenterToLandlordInterface) {
    this.renterInfo = data.renterInfo;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_INTERESTED_RENTER_TO_LANDLORD_EVENT_NAME = 'broadcast.interestedRenterInfo.landlord';
