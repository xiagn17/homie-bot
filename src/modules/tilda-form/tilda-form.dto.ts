import { IsString, IsNumber, IsDate } from 'class-validator';
import { RenterRequestType } from './tilda-form.types';

export class RenterRequest implements RenterRequestType {
  @IsString()
  name: string;

  @IsString()
  sex: 'Муж.' | 'Жен.';

  @IsNumber()
  birthdayDate: number;

  @IsString()
  phone: string;

  @IsString()
  moneyRange: string;

  @IsString()
  plannedArrivalDate: string;

  @IsString()
  location: string;

  @IsString()
  subwayStations: string;

  @IsString()
  university: string;

  @IsString()
  interests: string;

  @IsString()
  interestsAdditionalArea: string;

  @IsString()
  socials: string;

  @IsString()
  telegram: string;

  @IsString()
  zodiacSign: string;

  @IsString()
  referrerLink: string;

  @IsString()
  utmSource: string;

  @IsString()
  requestId: string;

  @IsDate()
  sentTime: Date;
}
