import { RenterReferralsEnum } from '../../../api/renters/interfaces/renter-referrals.interface';

interface BroadcastReferralContactsRenterInterface {
  from: RenterReferralsEnum;
  chatId: string;
}
export class BroadcastReferralContactsRenterEvent implements BroadcastReferralContactsRenterInterface {
  from: RenterReferralsEnum;

  chatId: string;

  constructor(data: BroadcastReferralContactsRenterInterface) {
    this.from = data.from;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_REFERRAL_CONTACTS_TO_RENTER_EVENT_NAME = 'broadcast.referralContacts.renter';
