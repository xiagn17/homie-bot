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

  public async getNextObject(chatId: string): Promise<ApiObjectResponse | null> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
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
    const renter = await this.entityManager
      .getCustomRepository(RentersRepository)
      .getByChatId(renterStatusOfObjectDto.chatId);
    const match = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .findOne({
        renterId: renter.id,
        landlordObjectId: renterStatusOfObjectDto.landlordObjectId,
      });
    if (match?.renterStatus === MatchStatusEnumType.resolved) {
      return;
    }

    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .changeRenterStatus(
        renter.id,
        renterStatusOfObjectDto.landlordObjectId,
        renterStatusOfObjectDto.renterStatus,
      );

    await this.tasksSchedulerService.removePushNewObjectToRenter({
      landlordObjectId: renterStatusOfObjectDto.landlordObjectId,
      chatId: renterStatusOfObjectDto.chatId,
    });
    if (renterStatusOfObjectDto.renterStatus === MatchStatusEnumType.rejected) {
      return;
    }

    const landlordObject = await this.entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .getFullObject(renterStatusOfObjectDto.landlordObjectId);

    const isPublishedByAdmins = landlordObject.isAdmin;
    if (isPublishedByAdmins) {
      await this.tasksSchedulerService.setAdminApproveObject({
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
