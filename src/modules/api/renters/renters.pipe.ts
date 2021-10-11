import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { INTERESTS_DATA, SUBWAY_STATIONS_DATA } from '../../../migrations/1629241839172-Initializing';
import { InterestEnumType, LocationEnumType, RenterDraftType, SubwayStationEnumType } from './renters.type';
import { CreateRenterDTO } from './renters.dto';

const stringSeparator = (splattedString: string, separator: string = ','): string[] =>
  splattedString.split(separator).map(m => m.trim());

// date example - '20/08/2021' dd-mm-yyyy
const dateTransformer = (date: string): Date => {
  const splattedDate: number[] = date.split('/').map(d => Number(d));
  return new Date(splattedDate[2], splattedDate[1] - 1, splattedDate[0]);
};

const parseSubwayStations = (subwayStations: string[]): SubwayStationEnumType[] => {
  return subwayStations
    .map(stationNumber => SUBWAY_STATIONS_DATA[Number(stationNumber)])
    .filter(subwayStation => !!subwayStation) as SubwayStationEnumType[];
};

const parseInterests = (interests: string[]): InterestEnumType[] => {
  return interests
    .map(interestNumber => INTERESTS_DATA[Number(interestNumber)])
    .filter(interest => !!interest) as InterestEnumType[];
};

@Injectable()
export class RentersPipe implements PipeTransform<RenterDraftType, CreateRenterDTO> {
  transform(value: RenterDraftType, _metadata: ArgumentMetadata): CreateRenterDTO {
    const result: CreateRenterDTO = {
      chatId: value.chatId,
      name: value.name,
      gender: value.gender,
      birthdayYear: value.birthdayYear,
      phone: value.phone,
      moneyRange: value.moneyRange,
      plannedArrivalDate: dateTransformer(value.plannedArrivalDate),
      location: value.location,
      subwayStations: [],
      zodiacSign: value.zodiacSign,
      university: value.university,
      interests: [],
      preferences: value.preferences,
      socials: value.socials,
      liveWithAnotherGender: value.liveWithAnotherGender,
    };
    if (value.subwayStations?.length) {
      const separated = stringSeparator(value.subwayStations);
      result.subwayStations = parseSubwayStations(separated);
    }
    const isChosenNevermindStation = result.subwayStations.find(
      (station: string) => station === SubwayStationEnumType.nevermind,
    );
    const isEmptySubwayStations = result.subwayStations.length === 0;
    if (result.location === LocationEnumType.center || isChosenNevermindStation || isEmptySubwayStations) {
      result.subwayStations = [SubwayStationEnumType.nevermind];
    }
    if (value.interests?.length) {
      const separated = stringSeparator(value.interests);
      result.interests = parseInterests(separated);
    }

    return result;
  }
}
