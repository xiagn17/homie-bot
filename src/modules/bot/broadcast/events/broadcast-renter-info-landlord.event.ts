import { ApiRenterFullInfo } from '../../../api/renters/interfaces/renter-info.interface';

interface BroadcastRenterInfoToLandlordInterface {
  renterInfo: ApiRenterFullInfo;
  chatId: string;
}
export class BroadcastRenterInfoToLandlordEvent implements BroadcastRenterInfoToLandlordInterface {
  renterInfo: ApiRenterFullInfo;

  chatId: string;

  constructor(data: BroadcastRenterInfoToLandlordInterface) {
    this.renterInfo = data.renterInfo;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_RENTER_INFO_TO_LANDLORD_EVENT_NAME = 'broadcast.renterInfo.landlord';
