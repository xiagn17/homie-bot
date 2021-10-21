import { TelegramUserType } from '../telegram-bot/telegram-bot.types';

export enum BusinessAnalyticsFieldsEnumType {
  entered = 'entered',
  start_fill_renter_info = 'start_fill_renter_info',
  end_fill_renter_info = 'end_fill_renter_info',
  next_step_renter_info = 'next_step_renter_info',
  created_match = 'created_match',
  showed_room_info = 'showed_room_info',
  connected_by_room = 'connected_by_room',
  success_match = 'success_match',
  pay_match = 'pay_match',
  pay_room_info = 'pay_room_info',
}

export interface ApiAnalyticsChangeStatusRequestType extends TelegramUserType {
  field: BusinessAnalyticsFieldsEnumType;
}
