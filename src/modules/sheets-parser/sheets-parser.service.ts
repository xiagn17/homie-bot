import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import flat from 'flat';
import { GoogleAuthService } from '../google-auth/google-auth.service';
import { clean } from '../../utils/clean';
import { SheetsParserSerializer } from './sheets-parser.serializer';
import {
  FilteredRentersType,
  FlattedRentersType,
  InnerFilterByArrivalType,
  InnerFilterByLocationType,
  InnerFilterByMoneyType,
  RenterType,
} from './sheets-parser.types';

const RENTERS_REQS_SPREADSHEET_ID = '1IkRrAJFUBPwjOOqRCTcMLFJVz4gasO6iBnFjwUjdTgM';
const LIST_REQS_NAME = 'LeadsFromTilda';

const PARSED_RENTERS_SPREADSHEET_ID = '1tdKgaw1MQvoifl84wzJFiAtxZWYhELRCsMlKQB0zR7I';
const PARSED_LIST_NAME = 'renters_new';

@Injectable()
export class SheetsParserService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private sheetsParserSerializer: SheetsParserSerializer,
  ) {}

  async parseSheet(): Promise<void> {
    const dataFromTable = await this.googleAuthService.getDataFromTable(
      RENTERS_REQS_SPREADSHEET_ID,
      LIST_REQS_NAME,
    );
    const renters = this.sheetsParserSerializer.serialize(dataFromTable);
    const filtered = this.filterRenters(renters);
    const dataForDocs = this.prepareBeforeDocs(filtered);
    await this.googleAuthService.putDataToTable(dataForDocs, {
      sheetId: PARSED_RENTERS_SPREADSHEET_ID,
      listName: PARSED_LIST_NAME,
    });
  }

  prepareBeforeDocs(filteredRenters: FilteredRentersType): any {
    const flatRenters: FlattedRentersType = clean(flat(filteredRenters, { safe: true, maxDepth: 4 }));
    const data: string[][] = [];
    const entries = Object.entries(flatRenters);
    entries
      .sort(([_keyA, valueA], [_keyB, valueB]) => {
        if (valueA.length < valueB.length) {
          return 1;
        }
        return -1;
      })
      .forEach(([key, value]) => {
        if (value.length === 1) {
          return;
        }

        data.push([`Группа ${key}`]);
        value.forEach(renter => {
          const deserialized = this.sheetsParserSerializer.deserialize(renter);
          data.push(deserialized);
        });
        data.push(['--------------------------------------------------------------------------']);
      });

    return data;
  }

  filterRenters(renters: RenterType[]): FilteredRentersType {
    const [afterThirtyAge, beforeThirtyAge] = _.partition(renters, renter => renter.age >= 30);
    const filteredRenters: FilteredRentersType = {
      '18-29': this.filterByMoney(beforeThirtyAge),
      '30+': this.filterByMoney(afterThirtyAge),
      by: 'age',
    };
    return filteredRenters;
    // не попавших можно искать так - отлавливать в массиве по индексу 1, склеивать их
  }

  filterByMoney(renters: RenterType[]): InnerFilterByMoneyType {
    const posiibleMoneyRanges = ['15000-20000', '20000-25000', '25000-30000', '30000-40000'];
    const filteredRenters = {
      '15-20': _.partition(renters, renter => posiibleMoneyRanges.slice(0, 2).includes(renter.moneyRange))[0],
      '20-25': _.partition(renters, renter => posiibleMoneyRanges.slice(0, 3).includes(renter.moneyRange))[0],
      '25-30': _.partition(renters, renter => posiibleMoneyRanges.slice(1, 4).includes(renter.moneyRange))[0],
      '30-40': _.partition(renters, renter => posiibleMoneyRanges.slice(2).includes(renter.moneyRange))[0],
    };

    const filteredRentersWithInner = {
      '15-20': this.filterByLocation(filteredRenters['15-20']),
      '20-25': this.filterByLocation(filteredRenters['20-25']),
      '25-30': this.filterByLocation(filteredRenters['25-30']),
      '30-40': this.filterByLocation(filteredRenters['30-40']),
      by: 'money',
    };
    return filteredRentersWithInner;
  }

  filterByLocation(renters: RenterType[]): InnerFilterByLocationType {
    const posiibleLocationRanges = [
      'Внутри садового кольца',
      'Внутри ТТК',
      'Внутри МКАД, близко к метро',
      'Внутри МКАД, неважно сколько до метро',
      'Не имеет значения',
    ];

    const filteredRenters = {
      SadovoeRing: _.partition(renters, renter =>
        posiibleLocationRanges.slice(0, 2).includes(renter.location),
      )[0],
      TTK: _.partition(renters, renter => posiibleLocationRanges.slice(0, 3).includes(renter.location))[0],
      MkadCloseSubway: _.partition(renters, renter =>
        posiibleLocationRanges.slice(1, 4).includes(renter.location),
      )[0],
      Mkad: _.partition(renters, renter => posiibleLocationRanges.slice(2, 4).includes(renter.location))[0],
      Nevermind: _.partition(renters, renter => posiibleLocationRanges.slice(4).includes(renter.location))[0],
    };

    const filteredRentersWithInner = {
      SadovoeRing: this.filterByArrival(filteredRenters.SadovoeRing),
      TTK: this.filterByArrival(filteredRenters.TTK),
      MkadCloseSubway: this.filterByArrival(filteredRenters.MkadCloseSubway),
      Mkad: this.filterByArrival(filteredRenters.Mkad),
      Nevermind: this.filterByArrival(filteredRenters.Nevermind),
      by: 'location',
    };
    return filteredRentersWithInner;
  }

  filterByArrival(renters: RenterType[]): InnerFilterByArrivalType {
    const possibleArrivals = ['сейчас', 'в течение недели', 'в течение 2-3 недель', 'через месяц и более'];

    const filteredRenters = {
      now: _.partition(renters, renter => possibleArrivals.slice(0, 1).includes(renter.plannedArrival))[0],
      inWeek: _.partition(renters, renter => possibleArrivals.slice(0, 3).includes(renter.plannedArrival))[0],
      inCoupleWeeks: _.partition(renters, renter =>
        possibleArrivals.slice(1, 4).includes(renter.plannedArrival),
      )[0],
      inMonthOrMore: _.partition(renters, renter =>
        possibleArrivals.slice(2).includes(renter.plannedArrival),
      )[0],
      by: 'arrival',
    };

    return filteredRenters;
  }
}
