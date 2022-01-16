import { RedisAdapter } from '@satont/grammy-redis-storage';
import { MiddlewareFn, LazySessionFlavor } from 'grammy';
import { MyContext } from '../../main/interfaces/bot.interface';

export interface SessionDataInterface {
  counter: number;
}
export type MySessionFlavour = LazySessionFlavor<SessionDataInterface>;

export type StorageInterface = RedisAdapter<SessionDataInterface>;
export type SessionStorageInterface = MiddlewareFn<MyContext & MySessionFlavour>;
