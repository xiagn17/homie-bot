import { MyContext } from '../../main/interfaces/bot.interface';

export type HandlerSendRequest = (objectId: string, ctx: MyContext) => Promise<void>;
export type HandlerGetContact = (objectId: string, ctx: MyContext) => Promise<void>;
export type HandlerGetNextObject = (objectId: string, ctx: MyContext) => Promise<void>;

export type HandlerRenterStopSearch = (ctx: MyContext) => Promise<void>;
