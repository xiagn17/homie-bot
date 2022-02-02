import { Injectable } from '@nestjs/common';
import { FlowXoFlowRunDataType, FlowXoRouteType } from './interfaces/flow-xo.type';

@Injectable()
export class FlowXoSerializer {
  prepareNotificationFlowData(
    { chatId, botId }: FlowXoRouteType,
    method:
      | 'admin_next_approve'
      | 'rent_next_object'
      | 'landlord_next_renter'
      | 'rent_landlord_contacts'
      | 'landlord_renew_object'
      | 'landlord_got_approve'
      | 'renter_paid_contacts',
    message: string,
  ): FlowXoFlowRunDataType {
    return {
      ...this.prepareRunFlowData(chatId, botId),
      data: {
        method: method,
        message: message,
      },
    };
  }

  private prepareRunFlowData(chatId: string, botId: string): FlowXoFlowRunDataType {
    return {
      bot_connection_id: botId,
      bot_id: botId,
      chat_id: chatId,
      response_path: `${botId}/c/${chatId}`,
    };
  }
}
