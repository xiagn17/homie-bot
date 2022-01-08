import { SubwayStationEnumType } from '../../entities/directories/SubwayStation.entity';
import { LocationEnumType } from '../../entities/directories/Location.entity';

const SUBWAY_STATIONS_IN_ORDER: SubwayStationEnumType[] = [
  SubwayStationEnumType.nevermind,
  SubwayStationEnumType.red,
  SubwayStationEnumType.green,
  SubwayStationEnumType.blue,
  SubwayStationEnumType.lightBlue,
  SubwayStationEnumType.ring,
  SubwayStationEnumType.orange,
  SubwayStationEnumType.purple,
  SubwayStationEnumType.yellow,
  SubwayStationEnumType.grey,
  SubwayStationEnumType.lightGreen,
  SubwayStationEnumType.lightPurple,
  SubwayStationEnumType.greyBlue,
];

const stringSeparator = (splattedString: string, separator: string = ','): string[] =>
  splattedString.split(separator).map(m => m.trim());
const parseSubwayStations = (subwayStations: string[]): SubwayStationEnumType[] => {
  return subwayStations
    .map(stationNumber => SUBWAY_STATIONS_IN_ORDER[Number(stationNumber)])
    .filter(subwayStation => !!subwayStation);
};

interface JsonValueType {
  location: LocationEnumType;
  subwayStations: string;
}
export function transformSubwayStations(value: JsonValueType): SubwayStationEnumType[] {
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
