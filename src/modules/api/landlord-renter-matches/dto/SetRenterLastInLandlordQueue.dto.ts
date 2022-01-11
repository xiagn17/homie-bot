import { IsString } from 'class-validator';
import { ApiSetRenterLastInLandlordQueue } from '../interfaces/landlord-renter-matches.types';

export class SetRenterLastInLandlordQueueDto implements ApiSetRenterLastInLandlordQueue {
  @IsString()
  renterId: string;

  @IsString()
  landlordObjectId: string;
}
