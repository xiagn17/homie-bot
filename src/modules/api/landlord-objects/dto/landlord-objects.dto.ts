import { ArrayMinSize, ArrayUnique, IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { dateTransformer } from '../../../../utils/transform/dateTransformer';
import { ApiLandlordObjectControlType, ApiLandlordObjectType } from '../interfaces/landlord-objects.type';

// todo абсолютно другая dto должна быть в соответствии с БД
export class CreateLandlordObjectDto extends TelegramChatIdDTO implements ApiLandlordObjectType {
  @IsString()
  address: string;

  @IsNumber()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  averageAge: number;

  @IsString()
  comment: string;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @ArrayMinSize(1)
  @ArrayUnique()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  photoIds: string[];

  @IsEnum(PreferredGenderEnumType)
  preferredGender: PreferredGenderEnumType;

  @IsString()
  price: string;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  showCouples: boolean;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  showWithAnimals: boolean;

  @IsDate()
  @Transform(({ value }) => dateTransformer(value), { toClassOnly: true })
  startArrivalDate: Date;
}

export class ApproveLandlordObjectDto implements ApiLandlordObjectControlType {
  @IsString()
  id: string;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  isApproved: boolean;
}
