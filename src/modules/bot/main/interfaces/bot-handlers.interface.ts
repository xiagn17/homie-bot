import { NextFunction } from 'grammy';
import { MenuFlavor } from '@grammyjs/menu/out/menu';
import { TelegramUserType } from '../../session-storage/interfaces/session-storage.interface';
import { MyContext } from './bot.interface';

export type HandlerStartCommand = (ctx: MyContext, next: NextFunction) => Promise<void>;

export type HandlerOnUserTypeRoute = (ctx: MyContext) => Promise<void>;
export type HandlerOnUserType = (
  type: TelegramUserType,
  ctx: MyContext & MenuFlavor,
  next: NextFunction,
) => Promise<void>;
