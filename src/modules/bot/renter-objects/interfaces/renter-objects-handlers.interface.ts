import { Filter, Middleware } from '@grammyjs/menu/out/deps.node';
import { MenuFlavor } from '@grammyjs/menu/out/menu';
import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerSendRequest = (objectId: string, ctx: MyContext) => Promise<void>;
export type HandlerGetNextObject = (objectId: string, ctx: MyContext) => Promise<void>;

export type HandlerRenterStopSearch = (ctx: MyContext) => Promise<void>;
export type HandlerOnFindObjectMenuButton = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;
export type HandlerOnFreeContactsMenuButton = Middleware<
  Filter<MyContext, 'callback_query:data'> & MenuFlavor
>;
export type HandlerOnFindObjectCallback = Middleware<MyContext>;
export type HandlerOnRenterNoAnketaConnect = Middleware<Filter<MyContext, 'callback_query:data'>>;
