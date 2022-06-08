export type NODE_ENV_TYPE = 'development' | 'production';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: NODE_ENV_TYPE;
    PORT: string;
    API_PREFIX: string;

    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USERNAME: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DATABASE: string;
    TYPEORM_SYNCHRONIZE: string;
    TYPEORM_LOGGING: string;
    TYPEORM_MIGRATIONS_RUN: string;

    REDIS_HOST: string;
    REDIS_PORT: string;

    TELEGRAM_TOKEN: string;
    TELEGRAM_BOT_ID: string;

    YOUKASSA_KEY: string;
    YOUKASSA_SHOP_ID: string;
    TWO_WEEKS_SUBSCRIPTION_PRICE: string;
    MONTH_SUBSCRIPTION_PRICE: string;

    GOOGLE_ANALYTICS_ID: string;

    ADMIN_USERNAME: string;
    SUBADMIN_USERNAME: string;
  }
}
