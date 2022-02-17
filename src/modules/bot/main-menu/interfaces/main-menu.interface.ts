import { MyContext } from '../../main/interfaces/bot.interface';

export type GetMainMenu = (ctx: MyContext) => Promise<void>;
export type GetFirstMenuTip = (ctx: MyContext) => Promise<void>;

export type GetMainMenuText = (ctx: MyContext) => Promise<string>;
