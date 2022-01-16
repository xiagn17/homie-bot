import { MyContext } from '../../main/interfaces/bot.interface';

export type StartHandlerInterface = (ctx: MyContext) => Promise<void>;
