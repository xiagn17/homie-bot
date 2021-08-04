import { Injectable } from '@nestjs/common';
import { GoogleAuthService } from '../google-auth/google-auth.service';

@Injectable()
export class SheetsParserService {
  constructor(private googleAuthService: GoogleAuthService) {}
  async parseSheet() {
    const rows = await this.googleAuthService.getDataFromTable();
    const preparedRows = rows.values.filter((row, i) => !!row[0] && i > 0);
    const jsonHumans = preparedRows.reduce((acc, cur) => {
      const human = {
        name: cur[0],
        sex: cur[1],
        birthdayDate: cur[2],
        phone: cur[3],
        moneyRange: cur[4],
        plannedArrival: cur[5],
        location: cur[6],
        subwayStations: cur[7],
        university: cur[8],
        interests: cur[9],
      };
      acc.push(human);
      return acc;
    }, []);
    return jsonHumans;
  }
}
