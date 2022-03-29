import { NODE_ENV_TYPE } from '../../typings/node';
import { ConfigurationType } from './interfaces/configuration.types';

export default (): ConfigurationType => {
  return {
    env: String(process.env.NODE_ENV) as NODE_ENV_TYPE,
    port: Number(process.env.PORT) || 3000,
    apiPrefix: String(process.env.API_PREFIX) || 'https://server.my-homie.ru/api',
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
    bot: {
      token: String(process.env.TELEGRAM_TOKEN),
      id: String(process.env.TELEGRAM_BOT_ID),
    },
    adminUsername: String(process.env.ADMIN_USERNAME),
    subAdminUsername: String(process.env.SUBADMIN_USERNAME),
    payments: {
      secretKey: String(process.env.YOUKASSA_KEY),
      shopId: String(process.env.YOUKASSA_SHOP_ID),
      prices: {
        oneContacts: String(process.env.ONE_CONTACTS_PRICE),
        fiveContacts: String(process.env.FIVE_CONTACTS_PRICE),
        privateHelper: String(process.env.PRIVATE_HELPER_PRICE),
      },
    },
    referral: {
      forInvitedUserOnStart: 1,
      bonusOnStart: 1,
      bonusOnFillRenterInfo: 2,
      bonusOnFillLandlordObject: 3,
    },
    googleAnalyticsId: String(process.env.GOOGLE_ANALYTICS_ID),
  };
};
