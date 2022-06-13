import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerService } from '../../logger/logger.service';
import { RenterEntity } from '../renters/entities/Renter.entity';
import {
  LandlordObjectIdsDataRaw,
  LandlordObjectsRepository,
} from '../landlord-objects/repositories/landlord-objects.repository';
import { PreferredGenderEnumType } from '../landlord-objects/entities/LandlordObject.entity';
import { GenderEnumType } from '../renters/interfaces/renters.type';
import { RentersRepository } from '../renters/repositories/renters.repository';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { ApiObjectResponse } from '../landlord-objects/interfaces/landlord-objects.type';
import { LandlordObjectsSerializer } from '../landlord-objects/landlord-objects.serializer';
import { RentersSerializer } from '../renters/serializers/renters.serializer';
import { RenterInfosSerializer } from '../renters/serializers/renter-infos.serializer';
import { RenterInfoEntity } from '../renters/entities/RenterInfo.entity';
import {
  BROADCAST_RENTER_INFO_TO_LANDLORD_EVENT_NAME,
  BroadcastRenterInfoToLandlordEvent,
} from '../../bot/broadcast/events/broadcast-renter-info-landlord.event';
import { RenterSettingsRepository } from '../renters/repositories/renter-settings.repository';
import { LandlordObjectRenterMatchesRepository } from './repositories/landlordObjectRenterMatches';
import { ChangeRenterStatusOfObjectDto } from './dto/ChangeRenterStatusOfObjectDto';
import { MatchStatusEnumType } from './interfaces/landlord-renter-matches.types';

@Injectable()
export class ObjectMatchesForRenterService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,

    private tasksSchedulerService: TasksSchedulerService,
    private readonly eventEmitter: EventEmitter2,

    private landlordObjectsSerializer: LandlordObjectsSerializer,
    private readonly renterInfosSerializer: RenterInfosSerializer,
    private readonly rentersSerializer: RentersSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async matchRenterToObjects(
    renter: RenterEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    const matchedObjects = await this.findMatchesForRenter(renter, entityManager);
    if (!matchedObjects.length) {
      return;
    }

    await entityManager
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

    await this.matchRenterToObjects(renter, entityManager);
  }

  public async findObject(chatId: string, objectNumber: number): Promise<ApiObjectResponse | null> {
    return this.entityManager.transaction(async entityManager => {
      const renter = await entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
      const landlordObject = await entityManager
        .getCustomRepository(LandlordObjectsRepository)
        .getActiveByNumber(objectNumber);
      if (!landlordObject) {
        return null;
      }

      const match = await entityManager.getCustomRepository(LandlordObjectRenterMatchesRepository).findOne({
        landlordObjectId: landlordObject.id,
        renterId: renter.id,
      });
      if (match) {
        return this.landlordObjectsSerializer.toResponse(landlordObject);
      }

      const { preferredGenders } = this.getImportantMatchProperties(renter);
      const genderMatches = preferredGenders.find(pref => pref === landlordObject.preferredGender);
      if (!genderMatches) {
        return null;
      }
      await entityManager
        .getCustomRepository(LandlordObjectRenterMatchesRepository)
        .createMatchesForRenter(renter, [{ landlordObjectId: landlordObject.id }]);

      return this.landlordObjectsSerializer.toResponse(landlordObject);
    });
  }

  public async getNextObject(chatId: string): Promise<ApiObjectResponse | null> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
    const isRenterStoppedSearch = !renter.renterSettingsEntity.inSearch;
    if (isRenterStoppedSearch) {
      await this.entityManager.getCustomRepository(RenterSettingsRepository).resumeSearch(renter.id);
      await this.matchRenterToObjects(renter);
    }

    const landlordObjectId = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getNextObjectIdForRenter(renter.id);
    if (!landlordObjectId) {
      return null;
    }

    const landlordObject = await this.entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .getFullObject(landlordObjectId);
    return this.landlordObjectsSerializer.toResponse(landlordObject);
  }

  // тут сразу renterId тоже
  public async changeRenterStatusOfObject(
    renterStatusOfObjectDto: ChangeRenterStatusOfObjectDto,
  ): Promise<void> {
    console.log('1');
    const renter = await this.entityManager
      .getCustomRepository(RentersRepository)
      .getByChatId(renterStatusOfObjectDto.chatId);
    console.log('2');
    const match = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .findOne({
        renterId: renter.id,
        landlordObjectId: renterStatusOfObjectDto.landlordObjectId,
      });
    console.log('3');
    if (match?.renterStatus === MatchStatusEnumType.resolved) {
      return;
    }
    console.log('4');
    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .changeRenterStatus(
        renter.id,
        renterStatusOfObjectDto.landlordObjectId,
        renterStatusOfObjectDto.renterStatus,
      );
    console.log('5');

    await this.tasksSchedulerService.removePushNewObjectToRenter({
      landlordObjectId: renterStatusOfObjectDto.landlordObjectId,
      chatId: renterStatusOfObjectDto.chatId,
    });
    console.log('6');

    if (renterStatusOfObjectDto.renterStatus === MatchStatusEnumType.rejected) {
      return;
    }

    const landlordObject = await this.entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .getFullObject(renterStatusOfObjectDto.landlordObjectId);

    const isPublishedByAdmins = landlordObject.isAdmin;
    if (isPublishedByAdmins) {
      await this.tasksSchedulerService.setAdminObjectSubmitRenter({
        renterId: renter.id,
        landlordObjectId: landlordObject.id,
      });
      return;
    }

    const renterInfo = this.renterInfosSerializer.toFullResponse(
      renter.renterInfoEntity as RenterInfoEntity,
      this.rentersSerializer.toFullResponse(renter),
    );
    await this.eventEmitter.emitAsync(
      BROADCAST_RENTER_INFO_TO_LANDLORD_EVENT_NAME,
      new BroadcastRenterInfoToLandlordEvent({
        renterInfo: renterInfo,
        chatId: landlordObject.telegramUser.chatId,
      }),
    );
  }

  private async findMatchesForRenter(
    renter: RenterEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<LandlordObjectIdsDataRaw[]> {
    const { preferredGenders } = this.getImportantMatchProperties(renter);

    const excludedObjectIds = await entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getAllObjectIdsForRenter(renter.id);

    const matchOptions = {
      preferredGender: preferredGenders,
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
      .findMatchesForRenterToObjects(matchOptions);
  }

  private getImportantMatchProperties(renter: RenterEntity): {
    preferredGenders: PreferredGenderEnumType[];
  } {
    const preferredGenders =
      renter.gender === GenderEnumType.MALE
        ? [PreferredGenderEnumType.MALE, PreferredGenderEnumType.NO_DIFFERENCE]
        : [PreferredGenderEnumType.FEMALE, PreferredGenderEnumType.NO_DIFFERENCE];
    return {
      preferredGenders: preferredGenders,
    };
  }
}
