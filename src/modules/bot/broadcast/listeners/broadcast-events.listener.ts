import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  BROADCAST_RENEW_OBJECT_EVENT_NAME,
  BroadcastRenewObjectEvent,
} from '../events/broadcast-renew-object.event';
import { BroadcastService } from '../broadcast.service';
import {
  BROADCAST_PAID_PRIVATE_HELPER_TO_ADMIN_EVENT_NAME,
  BroadcastPaidPrivateHelperToAdminEvent,
} from '../events/broadcast-paid-private-helper-admin.event';
import {
  BROADCAST_PAID_PRIVATE_HELPER_TO_BUYER_EVENT_NAME,
  BroadcastPaidPrivateHelperToBuyerEvent,
} from '../events/broadcast-paid-private-helper-buyer.event';
import {
  BROADCAST_PAID_CONTACTS_TO_BUYER_EVENT_NAME,
  BroadcastPaidContactsToBuyerEvent,
} from '../events/broadcast-paid-contacts-buyer.event';
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

@Injectable()
export class BroadcastEventsListener {
  constructor(private readonly broadcastService: BroadcastService) {}

  @OnEvent(BROADCAST_RENEW_OBJECT_EVENT_NAME)
  async handleRenewObject(data: BroadcastRenewObjectEvent): Promise<void> {
    await this.broadcastService.sendRenewObjectToLandlord(data.object, { chatId: data.chatId });
  }

  @OnEvent(BROADCAST_PAID_PRIVATE_HELPER_TO_ADMIN_EVENT_NAME)
  async handlePaidPrivateHelperToAdmin(data: BroadcastPaidPrivateHelperToAdminEvent): Promise<void> {
    await this.broadcastService.sendSuccessfulPaidPrivateHelperToAdmin(data.username, {
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_PAID_PRIVATE_HELPER_TO_BUYER_EVENT_NAME)
  async handlePaidPrivateHelperToBuyer(data: BroadcastPaidPrivateHelperToBuyerEvent): Promise<void> {
    await this.broadcastService.sendSuccessfulPaidPrivateHelper({
      chatId: data.chatId,
    });
  }

  @OnEvent(BROADCAST_PAID_CONTACTS_TO_BUYER_EVENT_NAME)
  async handlePaidContactsToBuyer(data: BroadcastPaidContactsToBuyerEvent): Promise<void> {
    await this.broadcastService.sendSuccessfulPaidContacts(data.contactsNumber, {
      chatId: data.chatId,
    });
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
    await this.broadcastService.sendNewObjectToRenter(data.object, {
      chatId: data.chatId,
    });
  }
}
