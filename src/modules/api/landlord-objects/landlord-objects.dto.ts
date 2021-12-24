import { ArrayMinSize, ArrayUnique, IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TelegramChatIdDTO } from '../telegram-bot/telegram-bot.dto';
import { LocationEnumType } from '../../../entities/directories/Location.entity';
import { PreferredGenderEnumType } from '../../../entities/landlord-objects/LandlordObject.entity';
import { SubwayStationEnumType } from '../../../entities/directories/SubwayStation.entity';
import { ApiLandlordObjectType } from './landlord-objects.type';

export class CreateLandlordObjectDto extends TelegramChatIdDTO implements ApiLandlordObjectType {
  @IsString()
  address: string;

  @IsNumber()
  averageAge: number;

  @IsString()
  comment: string;

  @IsEnum(LocationEnumType)
  location: LocationEnumType;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @ArrayMinSize(1)
  @ArrayUnique()
  photoUrls: string[];

  @IsEnum(PreferredGenderEnumType)
  preferredGender: PreferredGenderEnumType;

  @IsString()
  price: string;

  @IsBoolean()
  showCouples: boolean;

  @IsBoolean()
  showWithAnimals: boolean;

  @IsDate()
  startArrivalDate: Date;

  @IsEnum(SubwayStationEnumType)
  subwayStations: SubwayStationEnumType[];
}
