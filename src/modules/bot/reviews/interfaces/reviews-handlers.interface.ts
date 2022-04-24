import { Middleware } from 'grammy/out/composer';
import { Filter } from 'grammy/out/filter';
import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerReviewReasonKeyboard = Middleware<Filter<MyContext, 'callback_query:data'>>;
export type HandlerReviewStarsKeyboard = Middleware<Filter<MyContext, 'callback_query:data'>>;
