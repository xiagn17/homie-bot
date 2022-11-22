import { IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiLandlordObjectControlType, ApiLandlordObjectDraft } from '../interfaces/landlord-objects.type';
import { LocationsEnum, ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';
import { PreferredGenderEnumType } from '../entities/LandlordObject.entity';

export class ApproveLandlordObjectDto implements ApiLandlordObjectControlType {
  @IsString()
  id: string;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  isApproved: boolean;
}

export class LandlordObjectCreate implements ApiLandlordObjectDraft {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  photoIds: string[];

  address: string;

  chatId: string;

  comment: string;

  location: LocationsEnum;

  name: string;

  objectType: ObjectTypeEnum;

  phoneNumber: string;

  preferredGender: PreferredGenderEnumType;

  price: string;

  roomsNumber: string;
}
