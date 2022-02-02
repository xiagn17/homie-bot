import { NODE_ENV_TYPE } from '../../../typings/node';

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

export interface RenterMatchesConfigType {
  trialMatchesCount: number;
  paidMatchesCount: number;
}

export interface RedisConfigType {
  host: string;
  port: number;
}

export interface BotConfigType {
  token: string;
}

export interface PaymentsPricesConfigType {
  oneContacts: string;
  fiveContacts: string;
}
export interface PaymentsConfigType {
  secretKey: string;
  shopId: string;
  prices: PaymentsPricesConfigType;
}

export interface ConfigurationType {
  env: NODE_ENV_TYPE;
  port: number;
  database: DatabaseConfigType;
  redis: RedisConfigType;
  adminUsername: string;
  subAdminUsername: string;
  bot: BotConfigType;
  payments: PaymentsConfigType;
}
