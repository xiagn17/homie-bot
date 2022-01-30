import { RedisAdapter } from '@satont/grammy-redis-storage';
import { MiddlewareFn, LazySessionFlavor } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';

export enum TelegramUserType {
  renter = 'renter',
  landlord = 'landlord',
}
export interface SessionDataInterface {
  type?: TelegramUserType;
  gender?: GenderEnumType;
}
export type MySessionFlavour = LazySessionFlavor<SessionDataInterface>;

export type StorageInterface = RedisAdapter<SessionDataInterface>;
export type SessionStorageInterface = MiddlewareFn<MyContext & MySessionFlavour>;
