import { IsString } from 'class-validator';
import {
  ApiChangeLandlordStatusOfObject,
  MatchStatusEnumType,
} from '../interfaces/landlord-renter-matches.types';

export class ChangeLandlordStatusOfObjectDto implements ApiChangeLandlordStatusOfObject {
  @IsString()
  renterId: string;

  @IsString()
  landlordObjectId: string;

  @IsString()
  landlordStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}
