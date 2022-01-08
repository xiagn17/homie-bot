declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string;

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

    TRIAL_FREE_MATCHES_COUNT: string;
    PAID_MATCHES_COUNT: string;

    ADMIN_USERNAME: string;
  }
}
