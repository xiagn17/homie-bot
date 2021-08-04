import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

const CONFIG_FILE = './google-sheets.json';
const SCOPES_AUTH = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1P9BwVJ6Xvah_IrfHZ03xjMwiJAG9TBVCSwGQJ7ZW9Sk';
const TABLE_NAME = 'LeadsFromTilda';

@Injectable()
export class GoogleAuthService {
  private async getAuth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: CONFIG_FILE,
      scopes: SCOPES_AUTH,
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    return { auth, googleSheets };
  }

  async getDataFromTable() {
    const { auth, googleSheets } = await this.getAuth();
    const { data } = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: TABLE_NAME,
    });
    return data;
  }
}
