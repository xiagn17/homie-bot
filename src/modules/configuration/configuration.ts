import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigurationType, GoogleSheetsConfigType } from './configuration.types';

const GOOGLE_SHEETS_CONFIG_FILENAME = 'google-sheets.json';

export default (): ConfigurationType => {
  const googleSheetConfigJson = readFileSync(
    join(__dirname, '..', '..', GOOGLE_SHEETS_CONFIG_FILENAME),
    'utf8',
  );
  const googleSheetConfig: GoogleSheetsConfigType = JSON.parse(
    googleSheetConfigJson,
  ) as GoogleSheetsConfigType;

  return {
    google_sheets: googleSheetConfig,
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
    telegramToken: String(process.env.TELEGRAM_TOKEN),
    sendpulse: {
      clientId: String(process.env.SENDPULSE_CLIENT_ID),
      clientSecret: String(process.env.SENDPULSE_CLIENT_SECRET),
    },
    renterMatches: {
      trialMatchesCount: Number(process.env.TRIAL_FREE_MATCHES_COUNT),
      paidMatchesCount: Number(process.env.PAID_MATCHES_COUNT),
    },
  };
};
