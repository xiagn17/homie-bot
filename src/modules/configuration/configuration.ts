import { ConfigurationType } from './configuration.types';

export default (): ConfigurationType => {
  return {
    port: Number(process.env.PORT) || 3000,
    database: {
      db_username: String(process.env.POSTGRES_USERNAME),
      db_password: String(process.env.POSTGRES_PASSWORD),
      db_database: String(process.env.POSTGRES_DATABASE),
      host: String(process.env.POSTGRES_HOST),
      port: parseInt(String(process.env.POSTGRES_PORT), 10),
      settings: {
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: process.env.TYPEORM_LOGGING === 'true',
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
      },
    },
    redis: {
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    },
    telegramToken: String(process.env.TELEGRAM_TOKEN),
    renterMatches: {
      trialMatchesCount: Number(process.env.TRIAL_FREE_MATCHES_COUNT),
      paidMatchesCount: Number(process.env.PAID_MATCHES_COUNT),
    },
    adminUsername: String(process.env.ADMIN_USERNAME),
  };
};
