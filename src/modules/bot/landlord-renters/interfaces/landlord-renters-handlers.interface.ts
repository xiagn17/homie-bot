import { Middleware } from 'grammy/out/composer';
import { Filter } from 'grammy/out/filter';
import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerLandlordRenterActions = Middleware<Filter<MyContext, 'callback_query:data'>>;
