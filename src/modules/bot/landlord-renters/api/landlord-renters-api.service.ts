import { Injectable } from '@nestjs/common';
import { ObjectMatchesForLandlordService } from '../../../api/landlord-renter-matches/object-matches.for-landlord.service';
import { MatchStatusEnumType } from '../../../api/landlord-renter-matches/interfaces/landlord-renter-matches.types';
import { LandlordObjectsService } from '../../../api/landlord-objects/landlord-objects.service';

@Injectable()
export class LandlordRentersApiService {
  constructor(
    private readonly objectMatchesForLandlordService: ObjectMatchesForLandlordService,
    private readonly landlordObjectsService: LandlordObjectsService,
  ) {}

  submitRenter(chatId: string, renterId: string): Promise<void> {
    return this.objectMatchesForLandlordService.changeLandlordStatusOfObject({
      chatId,
      landlordStatus: MatchStatusEnumType.resolved,
      renterId: renterId,
    });
  }

  declineRenter(chatId: string, renterId: string): Promise<void> {
    return this.objectMatchesForLandlordService.changeLandlordStatusOfObject({
      chatId,
      landlordStatus: MatchStatusEnumType.rejected,
      renterId: renterId,
    });
  }

  stopSearchObject(chatId: string): Promise<void> {
    return this.landlordObjectsService.archiveObject({ chatId });
  }
}
