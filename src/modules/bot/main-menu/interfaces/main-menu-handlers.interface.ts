import { Filter, Middleware } from '@grammyjs/menu/out/deps.node';
import { MenuFlavor } from '@grammyjs/menu/out/menu';
import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerOnGetMenu = (ctx: MyContext) => Promise<void>;
export type HandlerOnNextObject = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;
export type HandlerOnFilters = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;
export type HandlerOnRenterInfo = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;
export type HandlerOnBackToMainMenu = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;

export type HandlerOnOther = (ctx: MyContext) => Promise<void>;
export type HandlerOnAbout = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;

export type HandlerOnLandlordObject = Middleware<Filter<MyContext, 'callback_query:data'> & MenuFlavor>;
