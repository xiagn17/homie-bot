export interface ApiTelegramUserCreateType {
  bot_id: string;
  channel_id: string;
  username: string | null;
}

export interface TelegramUserType {
  chatId: string; // user's telegram id
  // todo[TECH] (отложить) сделать везде обязательным
  botId?: string;
}

export interface TelegramUserResposeType {
  username: string;
}
