import { MyContext } from '../../main/interfaces/bot.interface';

export type SendReviewReason = (ctx: MyContext) => Promise<void>;
export type SendReviewStars = (ctx: MyContext) => Promise<void>;
export type SendReviewForm = (ctx: MyContext) => Promise<void>;
