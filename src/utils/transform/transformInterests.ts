import { InterestEnumType } from '../../modules/api/directories/interfaces/interests.interface';

const INTERESTS_DATA_IN_ORDER: InterestEnumType[] = [
  InterestEnumType.clubs,
  InterestEnumType.sport,
  InterestEnumType.art,
  InterestEnumType.cinema,
  InterestEnumType.music,
  InterestEnumType.events,
  InterestEnumType.politics,
  InterestEnumType.fashion,
  InterestEnumType.cooking,
];

const stringSeparator = (splattedString: string, separator: string = ','): string[] =>
  splattedString.split(separator).map(m => m.trim());
const parseInterests = (interests: string[]): InterestEnumType[] => {
  return interests
    .map(interestNumber => INTERESTS_DATA_IN_ORDER[Number(interestNumber)])
    .filter(interest => !!interest);
};

interface JsonValueType {
  interests?: string;
}
export function transformInterests(value: JsonValueType): InterestEnumType[] {
  let interests: InterestEnumType[] = [];
  if (value.interests?.length) {
    const separated = stringSeparator(value.interests);
    interests = parseInterests(separated);
  }
  return interests;
}
