export interface SendpulseAuthResponseType {
  access_token: string;
  token_type: string;
  expires_in: number;
}
export interface SendpulseAuthDataType {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
}

export interface SendpulseFlowRunDataType {
  contact_id: string;
  flow_id: string;
  external_data: Record<string, string>; // user's variables
}
export interface SendpulseFlowRunResponseType {
  success: boolean;
}
