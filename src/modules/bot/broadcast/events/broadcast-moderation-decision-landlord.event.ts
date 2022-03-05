interface BroadcastModerationDecisionToLandlordInterface {
  isApproved: boolean;
  chatId: string;
}
export class BroadcastModerationDecisionToLandlordEvent
  implements BroadcastModerationDecisionToLandlordInterface
{
  isApproved: boolean;

  chatId: string;

  constructor(data: BroadcastModerationDecisionToLandlordInterface) {
    this.isApproved = data.isApproved;
    this.chatId = data.chatId;
  }
}

export const BROADCAST_MODERATION_DECISION_TO_LANDLORD_EVENT_NAME = 'broadcast.moderationDecision.landlord';
