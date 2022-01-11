import { IsString } from 'class-validator';
import { ApiChangeLandlordStatusOfObject } from '../interfaces/landlord-renter-matches.types';
import { MatchStatusEnumType } from '../../renter-matches/interfaces/renter-matches.type';

export class ChangeLandlordStatusOfObjectDto implements ApiChangeLandlordStatusOfObject {
  @IsString()
  renterId: string;

  @IsString()
  landlordObjectId: string;

  @IsString()
  landlordStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}
