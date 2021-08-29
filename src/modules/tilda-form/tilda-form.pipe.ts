import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// todo подумать насколько тут можно типизировать и насколько это окей
const stringSeparator = (splattedString: string): string[] => splattedString.split(';').map(m => m.trim());

// date example - '20-08-2021' dd-mm-yyyy
const dateTransformer = (date: string): Date => {
  const splattedDate: number[] = date.split('-').map(d => Number(d));
  return new Date(splattedDate[2], splattedDate[1] - 1, splattedDate[0]);
};

@Injectable()
export class RenterTransformToDTO implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata): any {
    if (value.test === 'test') {
      return value;
    }

    value.requestId = value.tranid;
    value.utmSource = value.utm_source;
    value.gender = value.gender === 'Муж.' ? 'male' : 'female';
    value.moneyRange = stringSeparator(value.moneyRange);
    value.plannedArrivalDate = dateTransformer(value.plannedArrivalDate);
    value.subwayStations = stringSeparator(value.subwayStations);
    if (value.interests) {
      value.interests = stringSeparator(value.interests);
    }

    delete value.tranid;
    delete value.utm_source;
    return value;
  }
}
