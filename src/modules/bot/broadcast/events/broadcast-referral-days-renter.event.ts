import { RenterReferralsEnum } from '../../../api/renters/interfaces/renter-referrals.interface';

interface BroadcastReferralDaysRenterInterface {
  from: RenterReferralsEnum;
  chatId: string;
}
export class BroadcastReferralDaysRenterEvent implements BroadcastReferralDaysRenterInterface {
  from: RenterReferralsEnum;

  chatId: string;

  constructor(data: BroadcastReferralDaysRenterInterface) {
    this.from = data.from;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_REFERRAL_DAYS_TO_RENTER_EVENT_NAME = 'broadcast.referralContacts.renter';
