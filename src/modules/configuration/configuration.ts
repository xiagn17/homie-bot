import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigurationType, GoogleSheetsConfigType } from './configuration.types';

const GOOGLE_SHEETS_CONFIG_FILENAME = 'google-sheets.json';

export default (): ConfigurationType => {
  const googleSheetConfigJson = readFileSync(
    join(__dirname, '../../../', GOOGLE_SHEETS_CONFIG_FILENAME),
    'utf8',
  );
  const googleSheetConfig: GoogleSheetsConfigType = JSON.parse(
    googleSheetConfigJson,
  ) as GoogleSheetsConfigType;

  return {
    google_sheets: googleSheetConfig,
    port: 3000,
  };
};
