export interface FlowXoFlowRunDataType {
  response_path: string;
  chat_id: string;
  bot_id: string;
  bot_connection_id: string;
  data?: Record<string, any>; // user's variables
}
export interface FlowXoDefaultResponseType {
  msg: 'success';
}
