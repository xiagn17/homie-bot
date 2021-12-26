import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SUBWAY_STATIONS_DATA } from '../../../migrations/1629241839172-Initializing';
import { SubwayStationEnumType } from '../../../entities/directories/SubwayStation.entity';
import { LocationEnumType } from '../../../entities/directories/Location.entity';
import { ApiLandlordObjectDraftType } from './landlord-objects.type';
import { CreateLandlordObjectDto } from './landlord-objects.dto';

const stringSeparator = (splattedString: string, separator: string = ','): string[] =>
  splattedString.split(separator).map(m => m.trim());

// date example - '22.12.2021' dd-mm-yyyy
const dateTransformer = (date: string): Date => {
  const splattedDate: number[] = date.split('.').map(d => Number(d));
  return new Date(splattedDate[2], splattedDate[1] - 1, splattedDate[0]);
};

const parseSubwayStations = (subwayStations: string[]): SubwayStationEnumType[] => {
  return subwayStations
    .map(stationNumber => SUBWAY_STATIONS_DATA[Number(stationNumber)])
    .filter(subwayStation => !!subwayStation) as SubwayStationEnumType[];
};

@Injectable()
export class LandlordObjectsPipe
  implements PipeTransform<ApiLandlordObjectDraftType, CreateLandlordObjectDto>
{
  transform(value: ApiLandlordObjectDraftType, _metadata: ArgumentMetadata): CreateLandlordObjectDto {
    return {
      ...value,
      subwayStations: this.parseSubwayStations(value),
      startArrivalDate: dateTransformer(value.startArrivalDate),
      averageAge: Number(value.averageAge),
      showCouples: value.showCouples === 'true',
      showWithAnimals: value.showWithAnimals === 'true',
      photoIds: JSON.parse(value.photoIds),
    };
  }

  private parseSubwayStations(value: ApiLandlordObjectDraftType): SubwayStationEnumType[] {
    let subwayStations: SubwayStationEnumType[] = [];

    if (value.subwayStations?.length) {
      const separated = stringSeparator(value.subwayStations);
      subwayStations = parseSubwayStations(separated);
    }
    const isChosenNevermindStation = subwayStations.find(
      (station: string) => station === SubwayStationEnumType.nevermind,
    );
    const isEmptySubwayStations = subwayStations.length === 0;
    if (value.location === LocationEnumType.center || isChosenNevermindStation || isEmptySubwayStations) {
      subwayStations = [SubwayStationEnumType.nevermind];
    }

    return subwayStations;
  }
}
