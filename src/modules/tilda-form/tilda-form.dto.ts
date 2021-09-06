import { IsString, IsNumber, IsDate, IsEnum, IsOptional } from 'class-validator';
import {
  GenderEnumType,
  InterestEnumType,
  LocationEnumType,
  MoneyRangeEnumType,
  RenterRequestType,
  SubwayStationEnumType,
} from './tilda-form.types';

export class RenterRequestDTO implements RenterRequestType {
  @IsString()
  name: string;

  @IsEnum(GenderEnumType)
  gender: GenderEnumType;

  @IsNumber()
  birthdayYear: number;

  @IsString()
  phone: string;

  @IsEnum(MoneyRangeEnumType, { each: true })
  moneyRange: MoneyRangeEnumType[];

  @IsDate()
  plannedArrivalDate: Date;

  @IsEnum(LocationEnumType)
  location: LocationEnumType;

  @IsEnum(SubwayStationEnumType, { each: true })
  subwayStations: SubwayStationEnumType[];

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsEnum(InterestEnumType, { each: true })
  interests?: InterestEnumType[];

  @IsOptional()
  @IsString()
  preferences?: string;

  @IsOptional()
  @IsString()
  zodiacSign?: string;

  @IsString()
  socials: string;

  @IsString()
  telegram: string;

  @IsString()
  utmSource: string;

  @IsString()
  requestId: string;

  @IsOptional()
  @IsString()
  test?: string;
}
