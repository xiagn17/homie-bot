import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { RenterEntity } from '../../../entities/renters/Renter.entity';
import { RentersRepository } from '../../../repositories/users/renters.repository';
import { SubwayStationsRepository } from '../../../repositories/directories/subwayStations.repository';
import { MoneyRangesRepository } from '../../../repositories/directories/moneyRanges.repository';
import { LocationsRepository } from '../../../repositories/directories/locations.repository';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import {
  LandlordObjectEntity,
  PreferredGenderEnumType,
} from '../../../entities/landlord-objects/LandlordObject.entity';
import { LandlordObjectRenterMatchesRepository } from '../../../repositories/matches/landlordObjectRenterMatches';
import { GenderEnumType } from '../renters/renters.type';
import { MatchStatusEnumType } from '../renter-matches/renter-matches.type';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { RentersService } from '../renters/renters.service';
import { ChangeLandlordStatusOfObjectDto } from './dto/ChangeLandlordStatusOfObjectDto';

@Injectable()
export class ObjectMatchesForLandlordService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,

    private flowXoService: FlowXoService,
    private landlordObjectsService: LandlordObjectsService,
    private rentersService: RentersService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async getObjectWithUnresolvedRenterMatches(chatId: string): Promise<LandlordObjectEntity | null> {
    const landlordObjectId = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getObjectIdWithUnresolvedRenters(chatId);
    if (!landlordObjectId) {
      return null;
    }
    return this.landlordObjectsService.getLandlordObject(landlordObjectId);
  }

  public async matchObjectToRenters(landlordObjectId: string): Promise<void> {
    const landlordObject = await this.landlordObjectsService.getLandlordObject(landlordObjectId);
    const matchedRenters = await this.findMatchesForObject(landlordObject);
    if (!matchedRenters.length) {
      return;
    }

    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .createMatchesForObject(landlordObject, matchedRenters);

    const matchedRentersIds = matchedRenters.map(r => r.id);
    const countOfUnprocessedObjectsByRenters = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getCountOfUnprocessedObjectsByRenters(matchedRentersIds);
    const renterIdsToSendNotification = countOfUnprocessedObjectsByRenters
      .filter(obj => obj.count === 1)
      .map(obj => obj.renterId);

    if (!renterIdsToSendNotification.length) {
      return;
    }
    await this.sendPushObjectToRenters(renterIdsToSendNotification);
  }

  public async getNextRenter(landlordObjectId: string): Promise<RenterEntity | null> {
    const landlordObject = await this.landlordObjectsService.getLandlordObject(landlordObjectId);
    const renterId = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getNextRenterIdForLandlord(landlordObject.id);
    if (!renterId) {
      return null;
    }

    return this.rentersService.getRenter(renterId);
  }

  public async changeLandlordStatusOfObject(
    landlordStatusOfObjectDto: ChangeLandlordStatusOfObjectDto,
  ): Promise<void> {
    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .changeLandlordStatus(
        landlordStatusOfObjectDto.renterId,
        landlordStatusOfObjectDto.landlordObjectId,
        landlordStatusOfObjectDto.landlordStatus,
      );

    if (landlordStatusOfObjectDto.landlordStatus === MatchStatusEnumType.resolved) {
      const renter = await this.rentersService.getRenter(landlordStatusOfObjectDto.renterId);
      const landlordObject = await this.landlordObjectsService.getLandlordObject(
        landlordStatusOfObjectDto.landlordObjectId,
      );

      await this.flowXoService.notificationLandlordContactsToRenter(landlordObject, renter.telegramUser);
    }
  }

  private async sendPushObjectToRenters(renterIds: string[]): Promise<void> {
    const rentersDataForSending = await this.entityManager
      .getCustomRepository(RentersRepository)
      .getRentersChatId(renterIds);
    const sending = rentersDataForSending.map(data =>
      this.flowXoService.notificationNewLandlordObjectToRenter(data),
    );
    await Promise.all(sending);
  }

  private async findMatchesForObject(
    landlordObject: LandlordObjectEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<RenterEntity[]> {
    const subwayStationIdsForMatch = await entityManager
      .getCustomRepository(SubwayStationsRepository)
      .getStationIdsForMatch(landlordObject.subwayStations);
    const moneyRangeIdsForMatch = await entityManager
      .getCustomRepository(MoneyRangesRepository)
      .getMoneyRangeIdsForLocationMatch(landlordObject.price);
    const locationIdsForMatch = await entityManager
      .getCustomRepository(LocationsRepository)
      .getLocationIdsForMatch(landlordObject.location);

    let gender: GenderEnumType | null = null;
    if (landlordObject.preferredGender !== PreferredGenderEnumType.NO_DIFFERENCE) {
      gender =
        landlordObject.preferredGender === PreferredGenderEnumType.MALE
          ? GenderEnumType.MALE
          : GenderEnumType.FEMALE;
    }
    const matchOptions = {
      gender: gender,
      moneyRangeIds: moneyRangeIdsForMatch,
      locationIds: locationIdsForMatch,
      subwayStationIds: subwayStationIdsForMatch,
    };
    return entityManager
      .getCustomRepository(RentersRepository)
      .findMatchesForObjectToRenters(landlordObject, matchOptions);
  }
}
