import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { dateTransformer } from '../../../../utils/transform/dateTransformer';
import { transformSubwayStations } from '../../../../utils/transform/transformSubwayStations';
import { transformInterests } from '../../../../utils/transform/transformInterests';
import { RenterType, GenderEnumType, WithAnotherGenderEnumType } from '../interfaces/renters.type';
import { SubwayStationEnumType } from '../../directories/interfaces/subway-stations.interface';
import { LocationEnumType } from '../../directories/interfaces/locations.interface';
import { MoneyRangeEnumType } from '../../directories/interfaces/money-ranges.interface';
import { InterestEnumType } from '../../directories/interfaces/interests.interface';

export class CreateRenterDTO implements RenterType {
  @IsString()
  chatId: string;

  @IsString()
  name: string;

  @IsEnum(GenderEnumType)
  gender: GenderEnumType;

  @IsNumber()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  birthdayYear: number;

  @IsString()
  phone: string;

  @IsEnum(MoneyRangeEnumType)
  moneyRange: MoneyRangeEnumType;

  @IsDate()
  @Transform(({ value }) => dateTransformer(value), { toClassOnly: true })
  plannedArrivalDate: Date;

  @IsEnum(LocationEnumType)
  location: LocationEnumType;

  @IsEnum(SubwayStationEnumType, { each: true })
  @Transform(({ obj }) => transformSubwayStations(obj), { toClassOnly: true })
  subwayStations: SubwayStationEnumType[];

  @IsString()
  zodiacSign?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsEnum(InterestEnumType, { each: true })
  @Transform(({ obj }) => transformInterests(obj), { toClassOnly: true })
  interests?: InterestEnumType[];

  @IsString()
  preferences?: string;

  @IsString()
  socials: string;

  @IsEnum(WithAnotherGenderEnumType)
  liveWithAnotherGender: WithAnotherGenderEnumType;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  withAnimals: boolean;
}
