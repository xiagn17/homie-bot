import { NODE_ENV_TYPE } from '../../typings/node';

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

export interface ConfigurationType {
  env: NODE_ENV_TYPE;
  port: number;
  database: DatabaseConfigType;
  redis: RedisConfigType;
  telegramToken: string;
  renterMatches: RenterMatchesConfigType;
  adminUsername: string;
  subAdminUsername: string;
}
