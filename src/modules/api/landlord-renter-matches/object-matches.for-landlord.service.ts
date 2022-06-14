import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerService } from '../../logger/logger.service';
import { RenterIdsDataRaw, RentersRepository } from '../renters/repositories/renters.repository';
import {
  LandlordObjectEntity,
  PreferredGenderEnumType,
} from '../landlord-objects/entities/LandlordObject.entity';
import { GenderEnumType } from '../renters/interfaces/renters.type';
import { RentersService } from '../renters/renters.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { LandlordObjectsRepository } from '../landlord-objects/repositories/landlord-objects.repository';
import {
  BROADCAST_LANDLORD_CONTACTS_TO_APPROVED_RENTER_EVENT_NAME,
  BroadcastLandlordContactsToApprovedRenterEvent,
} from '../../bot/broadcast/events/broadcast-landlord-contacts-approved-renter.event';
import { LandlordObjectRenterMatchesRepository } from './repositories/landlordObjectRenterMatches';
import {
  ApiChangeLandlordStatusOfObject,
  MatchStatusEnumType,
} from './interfaces/landlord-renter-matches.types';

@Injectable()
export class ObjectMatchesForLandlordService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,

    private rentersService: RentersService,

    private tasksSchedulerService: TasksSchedulerService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async matchObjectToRenters(
    landlordObject: LandlordObjectEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    const matchedRenters = await this.findMatchesForObject(landlordObject, entityManager);
    if (!matchedRenters.length) {
      return;
    }

    await entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .createMatchesForObject(landlordObject, matchedRenters);

    const matchedRentersIds = matchedRenters.map(r => r.renterId);
    await this.sendNewObjectToRenters(matchedRentersIds, landlordObject.id);
  }

  public async changeLandlordStatusOfObject(
    landlordStatusOfObjectDto: ApiChangeLandlordStatusOfObject,
    transactionEntityManager?: EntityManager,
  ): Promise<void> {
    const run = async (entityManager: EntityManager): Promise<void> => {
      const object = ((landlordStatusOfObjectDto.chatId &&
        (await entityManager
          .getCustomRepository(LandlordObjectsRepository)
          .getByChatId(landlordStatusOfObjectDto.chatId))) ??
        (landlordStatusOfObjectDto.landlordObjectId &&
          (await entityManager
            .getCustomRepository(LandlordObjectsRepository)
            .getFullObject(landlordStatusOfObjectDto.landlordObjectId)))) as LandlordObjectEntity;

      await entityManager
        .getCustomRepository(LandlordObjectRenterMatchesRepository)
        .changeLandlordStatus(
          landlordStatusOfObjectDto.renterId,
          object.id,
          landlordStatusOfObjectDto.landlordStatus,
        );

      if (!object.isAdmin) {
        await entityManager.getCustomRepository(LandlordObjectsRepository).renewObject(object.id);
        await this.tasksSchedulerService.setTaskLandlordRenewNotification(object, undefined, entityManager);
      }

      if (landlordStatusOfObjectDto.landlordStatus === MatchStatusEnumType.resolved) {
        console.log('trying get renterrr', landlordStatusOfObjectDto.renterId);
        const renter = await this.rentersService.getRenter(landlordStatusOfObjectDto.renterId, entityManager);
        console.log('we got renter', renter.id, renter.telegramUser.chatId);
        await this.eventEmitter.emitAsync(
          BROADCAST_LANDLORD_CONTACTS_TO_APPROVED_RENTER_EVENT_NAME,
          new BroadcastLandlordContactsToApprovedRenterEvent({
            object: object,
            chatId: renter.telegramUser.chatId,
          }),
        );
      }
    };

    transactionEntityManager
      ? await run(transactionEntityManager)
      : await this.entityManager.transaction(run);
  }

  private async sendNewObjectToRenters(renterIds: string[], landlordObjectId: string): Promise<void> {
    const rentersDataForSending = await this.entityManager
      .getCustomRepository(RentersRepository)
      .getRentersChatId(renterIds);
    const setTasks = rentersDataForSending.map(data =>
      this.tasksSchedulerService.setPushNewObjectToRenter({
        landlordObjectId: landlordObjectId,
        chatId: data.chatId,
      }),
    );
    await Promise.all(setTasks);
  }

  private async findMatchesForObject(
    landlordObject: LandlordObjectEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<RenterIdsDataRaw[]> {
    let gender: GenderEnumType | null = null;
    if (landlordObject.preferredGender !== PreferredGenderEnumType.NO_DIFFERENCE) {
      gender =
        landlordObject.preferredGender === PreferredGenderEnumType.MALE
          ? GenderEnumType.MALE
          : GenderEnumType.FEMALE;
    }
    const excludedRenterIds = await entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getAllRenterIdsForObject(landlordObject.id);

    const matchOptions = {
      gender: gender,
      location: landlordObject.location,
      objectType: landlordObject.objectType,
      price: Number(landlordObject.price),
      excludedRenterIds: excludedRenterIds,
    };
    return entityManager.getCustomRepository(RentersRepository).findMatchesForObjectToRenters(matchOptions);
  }
}
