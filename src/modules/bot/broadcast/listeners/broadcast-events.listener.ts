import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  BROADCAST_RENEW_OBJECT_EVENT_NAME,
  BroadcastRenewObjectEvent,
} from '../events/broadcast-renew-object.event';
import { BroadcastService } from '../broadcast.service';
import {
  BROADCAST_LANDLORD_CONTACTS_TO_APPROVED_RENTER_EVENT_NAME,
  BroadcastLandlordContactsToApprovedRenterEvent,
} from '../events/broadcast-landlord-contacts-approved-renter.event';
import {
  BROADCAST_RENTER_INFO_TO_LANDLORD_EVENT_NAME,
  BroadcastRenterInfoToLandlordEvent,
} from '../events/broadcast-renter-info-landlord.event';
import {
  BROADCAST_MODERATION_DECISION_TO_LANDLORD_EVENT_NAME,
  BroadcastModerationDecisionToLandlordEvent,
} from '../events/broadcast-moderation-decision-landlord.event';
import {
  BROADCAST_MODERATION_TO_ADMIN_EVENT_NAME,
  BroadcastModerationToAdminEvent,
} from '../events/broadcast-moderation-admin.event';
import {
  BROADCAST_NEW_OBJECT_TO_RENTER_EVENT_NAME,
  BroadcastNewObjectToRenterPushEvent,
} from '../events/broadcast-new-object-renter-push.event';
import {
  BROADCAST_OBJECT_OUTDATED_TO_LANDLORD_EVENT_NAME,
  BroadcastObjectOutdatedPushEvent,
} from '../events/broadcast-object-outdated.event';
import {
  BROADCAST_REFERRAL_DAYS_TO_RENTER_EVENT_NAME,
  BroadcastReferralDaysRenterEvent,
} from '../events/broadcast-referral-days-renter.event';
import {
  BROADCAST_SEND_MESSAGE_TASK_EVENT_NAME,
  BroadcastSendMessageTaskEvent,
} from '../events/broadcast-send-message-user.event';
import {
  BROADCAST_SUBSCRIPTION_START_EVENT_NAME,
  BroadcastSubscriptionStartEvent,
} from '../events/broadcast-subscription-start.event';

@Injectable()
export class BroadcastEventsListener {
  constructor(private readonly broadcastService: BroadcastService) {}

  @OnEvent(BROADCAST_RENEW_OBJECT_EVENT_NAME)
  async handleRenewObject(data: BroadcastRenewObjectEvent): Promise<void> {
    await this.broadcastService.sendRenewObjectToLandlord(data.object, { chatId: data.chatId });
  }

  @OnEvent(BROADCAST_LANDLORD_CONTACTS_TO_APPROVED_RENTER_EVENT_NAME)
  async handleLandlordContactsToApprovedRenter(
    data: BroadcastLandlordContactsToApprovedRenterEvent,
  ): Promise<void> {
    await this.broadcastService.sendLandlordContactsToApprovedRenter(data.object, {
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_RENTER_INFO_TO_LANDLORD_EVENT_NAME)
  async handleRenterInfoToLandlord(data: BroadcastRenterInfoToLandlordEvent): Promise<void> {
    await this.broadcastService.sendRenterInfoToLandlord(data.renterInfo, {
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_MODERATION_DECISION_TO_LANDLORD_EVENT_NAME)
  async handleModerationDecisionToLandlord(data: BroadcastModerationDecisionToLandlordEvent): Promise<void> {
    await this.broadcastService.sendModerationDecisionToLandlord(data.isApproved, {
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_MODERATION_TO_ADMIN_EVENT_NAME)
  async handleModerationToAdmin(data: BroadcastModerationToAdminEvent): Promise<void> {
    await this.broadcastService.sendModerationMessageToAdmin(data.object, {
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_NEW_OBJECT_TO_RENTER_EVENT_NAME)
  async handleNewObjectToRenterPush(data: BroadcastNewObjectToRenterPushEvent): Promise<void> {
    await this.broadcastService.sendNewObjectToRenter(
      data.object,
      {
        chatId: data.chatId,
      },
      data.entityManager,
    );
  }

  @OnEvent(BROADCAST_OBJECT_OUTDATED_TO_LANDLORD_EVENT_NAME)
  async handleObjectOutdatedToLandlordPush(data: BroadcastObjectOutdatedPushEvent): Promise<void> {
    await this.broadcastService.sendObjectOutdatedToLandlord(data.object, {
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_REFERRAL_DAYS_TO_RENTER_EVENT_NAME)
  async handleReferralDaysToRenter(data: BroadcastReferralDaysRenterEvent): Promise<void> {
    await this.broadcastService.sendReferralDaysToRenter(data.from, { chatId: data.chatId });
  }

  @OnEvent(BROADCAST_SEND_MESSAGE_TASK_EVENT_NAME)
  async handleSendMessageTask(data: BroadcastSendMessageTaskEvent): Promise<void> {
    await this.broadcastService.sendMessageTask(data.message, { chatId: data.chatId }, data.markup);
  }

  @OnEvent(BROADCAST_SUBSCRIPTION_START_EVENT_NAME)
  async handleSubscriptionStart(data: BroadcastSubscriptionStartEvent): Promise<void> {
    await this.broadcastService.sendSubscriptionStart(data.endsAt, { chatId: data.chatId });
  }
}
