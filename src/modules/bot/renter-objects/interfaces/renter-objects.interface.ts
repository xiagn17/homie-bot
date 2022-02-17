import { MyContext } from '../../main/interfaces/bot.interface';

export type SendNextObject = (ctx: MyContext) => Promise<void>;
export type GetContact = (objectId: string, ctx: MyContext) => Promise<boolean>;
export type SendRenterInfoNotExists = (objectId: string, ctx: MyContext) => Promise<void>;
export type SendObjectRequest = (objectId: string, ctx: MyContext) => Promise<void>;
