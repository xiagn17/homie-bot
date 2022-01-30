import { MyContext } from '../../interfaces/bot.interface';
import { TelegramUserType } from '../../../session-storage/interfaces/session-storage.interface';

export type DefaultHandlerInterface = (ctx: MyContext) => Promise<void>;
export type ChooseUserTypeHandlerInterface = (type: TelegramUserType, ctx: MyContext) => Promise<void>;
export type StartHandlerInterface = DefaultHandlerInterface;
