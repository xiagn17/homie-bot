import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { RenterEntity } from '../renters/entities/Renter.entity';
import { LandlordObjectsRepository } from '../landlord-objects/repositories/landlord-objects.repository';
import {
  LandlordObjectEntity,
  PreferredGenderEnumType,
} from '../landlord-objects/entities/LandlordObject.entity';
import { GenderEnumType } from '../renters/interfaces/renters.type';
import { RentersRepository } from '../renters/repositories/renters.repository';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { ApiObjectPreviewInterface } from '../landlord-objects/interfaces/landlord-objects.type';
import { LandlordObjectsSerializer } from '../landlord-objects/landlord-objects.serializer';
import { LandlordObjectRenterMatchesRepository } from './repositories/landlordObjectRenterMatches';
import { ChangeRenterStatusOfObjectDto } from './dto/ChangeRenterStatusOfObjectDto';
import { MatchStatusEnumType } from './interfaces/landlord-renter-matches.types';

@Injectable()
export class ObjectMatchesForRenterService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,
    private flowXoService: FlowXoService,

    private landlordObjectsService: LandlordObjectsService,
    private tasksSchedulerService: TasksSchedulerService,

    private landlordObjectsSerializer: LandlordObjectsSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async matchRenterToObjects(renter: RenterEntity): Promise<void> {
    const matchedObjects = await this.findMatchesForRenter(renter);
    if (!matchedObjects.length) {
      return;
    }

    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .createMatchesForRenter(renter, matchedObjects);
  }

  public async recreateMatches(
    renter: RenterEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    await entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .deleteUnprocessedObjectsForRenter(renter.id);

    const matchedObjects = await this.findMatchesForRenter(renter, entityManager);
    if (!matchedObjects.length) {
      return;
    }

    await entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .createMatchesForRenter(renter, matchedObjects);
  }

  public async getNextObject(chatId: string): Promise<ApiObjectPreviewInterface | null> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
    const landlordObjectId = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getNextObjectIdForRenter(renter.id);
    if (!landlordObjectId) {
      return null;
    }

    const landlordObject = await this.landlordObjectsService.getLandlordObject(landlordObjectId);
    return this.landlordObjectsSerializer.toPreview(landlordObject);
  }

  // тут сразу renterId тоже
  public async changeRenterStatusOfObject(
    renterStatusOfObjectDto: ChangeRenterStatusOfObjectDto,
  ): Promise<void> {
    const renter = await this.entityManager
      .getCustomRepository(RentersRepository)
      .getByChatId(renterStatusOfObjectDto.chatId);
    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .changeRenterStatus(
        renter.id,
        renterStatusOfObjectDto.landlordObjectId,
        renterStatusOfObjectDto.renterStatus,
      );

    if (renterStatusOfObjectDto.renterStatus === MatchStatusEnumType.rejected) {
      return;
    }

    const landlordObject = await this.landlordObjectsService.getLandlordObject(
      renterStatusOfObjectDto.landlordObjectId,
    );

    const isPublishedByAdmins = landlordObject.isAdmin;
    if (isPublishedByAdmins) {
      await this.tasksSchedulerService.setAdminApproveObject({
        renterId: renter.id,
        landlordObjectId: landlordObject.id,
      });
      return;
    }
    await this.flowXoService.notificationNewRenterToLandlord(landlordObject.telegramUser);
  }

  private async findMatchesForRenter(
    renter: RenterEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<LandlordObjectEntity[]> {
    const preferredGender =
      renter.gender === GenderEnumType.MALE
        ? [PreferredGenderEnumType.MALE, PreferredGenderEnumType.NO_DIFFERENCE]
        : [PreferredGenderEnumType.FEMALE, PreferredGenderEnumType.NO_DIFFERENCE];

    const excludedObjectIds = await entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getAllObjectIdsForRenter(renter.id);

    const matchOptions = {
      preferredGender: preferredGender,
      locations: renter.renterFiltersEntity.locations,
      objectTypes: renter.renterFiltersEntity.objectType,
      priceRange:
        renter.renterFiltersEntity.priceRangeStart !== null &&
        renter.renterFiltersEntity.priceRangeEnd !== null
          ? ([renter.renterFiltersEntity.priceRangeStart, renter.renterFiltersEntity.priceRangeEnd] as [
              number,
              number,
            ])
          : null,
      excludedObjectIds: excludedObjectIds,
    };

    return entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .findMatchesForRenterToObjects(renter, matchOptions);
  }
}
