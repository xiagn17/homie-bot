import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { LocationEnumType } from '../../../entities/directories/Location.entity';
import { SubwayStationEnumType } from '../../../entities/directories/SubwayStation.entity';
import { InterestEnumType } from '../../../entities/directories/Interest.entity';
import { MoneyRangeEnumType } from '../../../entities/directories/MoneyRange.entity';
import { dateTransformer } from '../../../utils/transform/dateTransformer';
import { transformSubwayStations } from '../../../utils/transform/transformSubwayStations';
import { transformInterests } from '../../../utils/transform/transformInterests';
import { RenterType, GenderEnumType, WithAnotherGenderEnumType } from './renters.type';

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
