import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

const CONFIG_FILE = './src/google-sheets.json';
const SCOPES_AUTH = ['https://www.googleapis.com/auth/spreadsheets'];

interface PutOptionsType {
  sheetId: string;
  listName: string;
}
@Injectable()
export class GoogleAuthService {
  async getDataFromTable(sheetId: string, listName: string): Promise<sheets_v4.Schema$ValueRange> {
    const googleSheets = await this.getSheets();
    const { data } = await googleSheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: listName,
    });
    return data;
  }

  async putDataToTable(data: string[][], options: PutOptionsType): Promise<void> {
    const googleSheets = await this.getSheets();
    await googleSheets.spreadsheets.values.clear({
      spreadsheetId: options.sheetId,
      range: options.listName,
    });
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: options.sheetId,
      valueInputOption: 'RAW',
      range: options.listName,
      requestBody: {
        range: options.listName,
        values: data,
      },
    });
  }

  private async getSheets(): Promise<sheets_v4.Sheets> {
    const auth = new google.auth.GoogleAuth({
      keyFile: CONFIG_FILE,
      scopes: SCOPES_AUTH,
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    google.options({
      auth,
    });

    return googleSheets;
  }
}
