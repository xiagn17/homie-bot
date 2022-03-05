import { IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiLandlordObjectControlType } from '../interfaces/landlord-objects.type';

export class ApproveLandlordObjectDto implements ApiLandlordObjectControlType {
  @IsString()
  id: string;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  isApproved: boolean;
}
