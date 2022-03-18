import ua from 'universal-analytics';
import { MyContext } from '../../modules/bot/main/interfaces/bot.interface';
import { ALL_ACTION, ALL_START_EVENT, TELEGRAM_CATEGORY } from './events';

const accountId = process.env.GOOGLE_ANALYTICS_ID;
if (!accountId) {
  throw new Error('No GOOGLE_ANALYTICS_ID in .env file');
}

export const createVisitor = (chatId: string): ua.Visitor => {
  return ua(accountId, chatId, { strictCidFormat: false, uid: chatId, cid: chatId });
};
// название кампании
export const setCampaign = (visitor: ua.Visitor, campaign: string): void => {
  visitor.set('cn', campaign);
};
// канал
export const setMedium = (visitor: ua.Visitor, medium: string): void => {
  visitor.set('cm', medium);
};
// источник
export const setSource = (visitor: ua.Visitor, source: string): void => {
  visitor.set('cs', source);
};

export const sendAnalyticsEvent = (
  ctxOrChatId: MyContext | string,
  action: string,
  label: string,
  category: string = TELEGRAM_CATEGORY,
): void => {
  let chatId: string | undefined;
  if (typeof ctxOrChatId !== 'string') {
    chatId = ctxOrChatId.from?.id.toString() as string;
  } else {
    chatId = ctxOrChatId;
  }

  const visitor = createVisitor(chatId);
  visitor.event(category, action, label).send();
};

export const sendAnalyticsStartChatEvent = (chatId: string, deepLink: string | null): void => {
  const visitor = createVisitor(chatId);
  if (deepLink) {
    setCampaign(visitor, deepLink);
  }
  visitor.event(TELEGRAM_CATEGORY, ALL_ACTION, ALL_START_EVENT).send();
};
