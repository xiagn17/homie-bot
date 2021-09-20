export interface GoogleSheetsConfigType {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}
export interface DatabaseConfigType {
  db_username: string;
  db_password: string;
  db_database: string;
  host: string;
  port: number;
  settings: {
    synchronize: boolean;
    logging: boolean;
    migrationsRun: boolean;
  };
}

export interface SendpulseConfigType {
  clientId: string;
  clientSecret: string;
}

export interface ConfigurationType {
  port: number;
  google_sheets: GoogleSheetsConfigType;
  database: DatabaseConfigType;
  telegramToken: string;
  sendpulse: SendpulseConfigType;
}
