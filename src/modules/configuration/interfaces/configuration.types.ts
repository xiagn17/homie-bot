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
  id: string;
}

export interface PaymentsPricesConfigType {
  subscriptionTwoWeeks: string;
  subscriptionMonth: string;
}
export interface PaymentsConfigType {
  secretKey: string;
  shopId: string;
  prices: PaymentsPricesConfigType;
}

export interface ReferralConfigType {
  bonusOnFillRenterInfo: number;
  bonusOnFillLandlordObject: number;
}

export interface ConfigurationType {
  env: NODE_ENV_TYPE;
  port: number;
  apiPrefix: string;
  database: DatabaseConfigType;
  redis: RedisConfigType;
  adminUsername: string;
  subAdminUsername: string;
  bot: BotConfigType;
  payments: PaymentsConfigType;
  referral: ReferralConfigType;
  googleAnalyticsId: string;
}
