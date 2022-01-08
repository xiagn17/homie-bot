import { IsString } from 'class-validator';
import { ApiChangeLandlordStatusOfObject } from '../landlord-renter-matches.types';
import { MatchStatusEnumType } from '../../renter-matches/renter-matches.type';

export class ChangeLandlordStatusOfObjectDto implements ApiChangeLandlordStatusOfObject {
  @IsString()
  renterId: string;

  @IsString()
  landlordObjectId: string;

  @IsString()
  landlordStatus: MatchStatusEnumType.resolved | MatchStatusEnumType.rejected;
}
