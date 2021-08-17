import { Injectable } from '@nestjs/common';
import { sheets_v4 } from 'googleapis';
import { RenterType, SheetRenterType } from './sheets-parser.types';

@Injectable()
export class SheetsParserSerializer {
  serialize(dataFromTable: sheets_v4.Schema$ValueRange): RenterType[] {
    const rows = (dataFromTable?.values ?? []) as SheetRenterType[];
    const filterToRemoveEmptyRows = (row: SheetRenterType, i: number): boolean => !!row[0] && i > 0;
    const serializedRenters = rows.filter(filterToRemoveEmptyRows).reduce<RenterType[]>((acc, cur) => {
      const [
        name,
        sex,
        birthdayDate,
        phone,
        moneyRange,
        plannedArrival,
        location,
        subwayStations,
        university,
        socials,
        telegram,
        interests,
        requestId,
        sentTime,
        referrerLink,
        utmSource,
        interestsAdditionalArea,
      ] = cur;
      const age = new Date().getFullYear() - Number(birthdayDate);
      const renter = {
        name,
        sex,
        birthdayDate,
        age,
        phone,
        moneyRange,
        plannedArrival,
        location,
        subwayStations,
        university,
        interests,
        interestsAdditionalArea,
        socials,
        telegram,
        referrerLink,
        utmSource,
        requestId,
        sentTime,
      };
      acc.push(renter);
      return acc;
    }, []);
    return serializedRenters;
  }

  deserialize(renter: RenterType): SheetRenterType {
    const {
      name,
      sex,
      birthdayDate,
      phone,
      moneyRange,
      plannedArrival,
      location,
      subwayStations,
      university,
      interests,
      interestsAdditionalArea,
      socials,
      telegram,
      referrerLink,
      utmSource,
      requestId,
      sentTime,
    } = renter;
    return [
      name,
      sex,
      birthdayDate,
      phone,
      moneyRange,
      plannedArrival,
      location,
      subwayStations,
      university,
      interests,
      interestsAdditionalArea,
      socials,
      telegram,
      referrerLink,
      utmSource,
      requestId,
      sentTime,
    ];
  }
}
