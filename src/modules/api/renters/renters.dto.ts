import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  RenterType,
  GenderEnumType,
  InterestEnumType,
  WithAnotherGenderEnumType,
  LocationEnumType,
  MoneyRangeEnumType,
  SubwayStationEnumType,
} from './renters.type';

export class CreateRenterDTO implements RenterType {
  @IsString()
  chatId: string;

  @IsString()
  name: string;

  @IsEnum(GenderEnumType)
  gender: GenderEnumType;

  @IsNumber()
  birthdayYear: number;

  @IsString()
  phone: string;

  @IsEnum(MoneyRangeEnumType)
  moneyRange: MoneyRangeEnumType;

  @IsDate()
  plannedArrivalDate: Date;

  @IsEnum(LocationEnumType)
  location: LocationEnumType;

  @IsEnum(SubwayStationEnumType, { each: true })
  subwayStations: SubwayStationEnumType[];

  @IsString()
  zodiacSign?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsEnum(InterestEnumType, { each: true })
  interests?: InterestEnumType[];

  @IsString()
  preferences?: string;

  @IsString()
  socials: string;

  @IsEnum(WithAnotherGenderEnumType)
  liveWithAnotherGender: WithAnotherGenderEnumType;

  @IsBoolean()
  withAnimals: boolean;
}
