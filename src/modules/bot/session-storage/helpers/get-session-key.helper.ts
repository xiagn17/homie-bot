import { Context } from 'grammy';

export function getSessionKey(ctx: Context): string | undefined {
  // Let all users in a group chat share the same session,
  // but give an independent private one to each user in private chats
  return ctx.chat?.id.toString();
}
