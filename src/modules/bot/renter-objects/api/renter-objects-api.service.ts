import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ObjectMatchesForRenterService } from '../../../api/landlord-renter-matches/object-matches.for-renter.service';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { LandlordObjectsService } from '../../../api/landlord-objects/landlord-objects.service';
import { MatchStatusEnumType } from '../../../api/landlord-renter-matches/interfaces/landlord-renter-matches.types';
import { RentersService } from '../../../api/renters/renters.service';
import { ApiRenterFull } from '../../../api/renters/interfaces/renters.type';
import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';

interface ChangeRenterStatusOfObjectData {
  objectId: string;
  chatId: string;
}

@Injectable()
export class RenterObjectsApiService {
  constructor(
    private readonly objectMatchesForRenterService: ObjectMatchesForRenterService,
    private readonly landlordObjectsService: LandlordObjectsService,
    private readonly rentersService: RentersService,
  ) {}

  async getNextObject(chatId: string): Promise<ApiObjectResponse | null> {
    return this.objectMatchesForRenterService.getNextObject(chatId);
  }

  async getObject(objectId: string): Promise<LandlordObjectEntity> {
    return this.landlordObjectsService.getLandlordObject(objectId);
  }

  async markObjectAsNotInterested(
    data: ChangeRenterStatusOfObjectData,
    entityManager?: EntityManager,
  ): Promise<void> {
    await this.objectMatchesForRenterService.changeRenterStatusOfObject(
      {
        renterStatus: MatchStatusEnumType.rejected,
        landlordObjectId: data.objectId,
        chatId: data.chatId,
      },
      entityManager,
    );
  }

  async markObjectAsInterested(data: ChangeRenterStatusOfObjectData): Promise<void> {
    await this.objectMatchesForRenterService.changeRenterStatusOfObject({
      renterStatus: MatchStatusEnumType.resolved,
      landlordObjectId: data.objectId,
      chatId: data.chatId,
    });
  }

  async startTrialSubscription(renterId: string): Promise<void> {
    await this.rentersService.startTrialSubscription(renterId);
  }

  async getRenterEntityOfUser(chatId: string): Promise<ApiRenterFull> {
    const renter = await this.rentersService.getRenterByChatId(chatId);
    return renter;
  }

  async isInfoExists(chatId: string): Promise<boolean> {
    return this.rentersService.isRenterInfoExists(chatId);
  }

  stopSearch(chatId: string): Promise<void> {
    return this.rentersService.stopSearch(chatId);
  }

  findObject(chatId: string, objectNumber: number): Promise<ApiObjectResponse | null> {
    return this.objectMatchesForRenterService.findObject(chatId, objectNumber);
  }
}
