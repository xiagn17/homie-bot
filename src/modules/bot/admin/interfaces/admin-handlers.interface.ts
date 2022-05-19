import { Middleware } from 'grammy/out/composer';
import { Filter } from 'grammy/out/filter';
import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerAdminModerationSubmit = Middleware<Filter<MyContext, 'callback_query:data'>>;
export type HandlerAdminModerationDecline = Middleware<Filter<MyContext, 'callback_query:data'>>;
export type HandlerAdminObjectStarred = Middleware<Filter<MyContext, 'callback_query:data'>>;
