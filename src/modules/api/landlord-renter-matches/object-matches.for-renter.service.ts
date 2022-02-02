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
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { LandlordObjectRenterMatchesRepository } from './repositories/landlordObjectRenterMatches';
import { ChangeRenterStatusOfObjectDto } from './dto/ChangeRenterStatusOfObjectDto';
import { MatchStatusEnumType } from './interfaces/landlord-renter-matches.types';

@Injectable()
export class ObjectMatchesForRenterService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,
    private flowXoService: FlowXoService,

    private telegramBotService: TelegramBotService,
    private landlordObjectsService: LandlordObjectsService,
    private tasksSchedulerService: TasksSchedulerService,
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

  // todo здесь должен быть renterId
  // возвращаем objectId
  public async getNextObject(chatId: string): Promise<LandlordObjectEntity | null> {
    const renter = await this.entityManager.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (!renter) {
      throw new Error(`No renter with chatId ${chatId}`);
    }
    const landlordObjectId = await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .getNextObjectIdForRenter(renter.id);
    if (!landlordObjectId) {
      return null;
    }

    return this.landlordObjectsService.getLandlordObject(landlordObjectId);
  }

  // тут сразу renterId тоже
  public async changeRenterStatusOfObject(
    renterStatusOfObjectDto: ChangeRenterStatusOfObjectDto,
  ): Promise<void> {
    const renter = await this.entityManager
      .getCustomRepository(RentersRepository)
      .getByChatId(renterStatusOfObjectDto.chatId);
    if (!renter) {
      throw new Error(`No renter with chatId ${renterStatusOfObjectDto.chatId}`);
    }
    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .changeRenterStatus(
        renter.id,
        renterStatusOfObjectDto.landlordObjectId,
        renterStatusOfObjectDto.renterStatus,
      );

    if (renterStatusOfObjectDto.renterStatus !== MatchStatusEnumType.resolved) {
      return;
    }

    const landlordObject = await this.landlordObjectsService.getLandlordObject(
      renterStatusOfObjectDto.landlordObjectId,
    );

    const isPublishedByAdmins = await this.isObjectPublishedByAdmins(landlordObject);
    if (isPublishedByAdmins) {
      await this.tasksSchedulerService.setAdminApproveObject({
        renterId: renter.id,
        landlordObjectId: landlordObject.id,
      });
      return;
    }
    await this.flowXoService.notificationNewRenterToLandlord(landlordObject.telegramUser);
  }

  private async isObjectPublishedByAdmins(landlordObject: LandlordObjectEntity): Promise<boolean> {
    const { chatId: adminChatId } = await this.telegramBotService.getAdmin();
    const { chatId: subAdminChatId } = await this.telegramBotService.getSubAdmin();
    return (
      adminChatId === landlordObject.telegramUser.chatId ||
      subAdminChatId === landlordObject.telegramUser.chatId
    );
  }

  private async findMatchesForRenter(
    renter: RenterEntity,
    entityManager: EntityManager = this.entityManager,
  ): Promise<LandlordObjectEntity[]> {
    const preferredGender =
      renter.gender === GenderEnumType.MALE
        ? [PreferredGenderEnumType.MALE, PreferredGenderEnumType.NO_DIFFERENCE]
        : [PreferredGenderEnumType.FEMALE, PreferredGenderEnumType.NO_DIFFERENCE];

    const matchOptions = {
      preferredGender: preferredGender,
      locations: renter.renterFiltersEntity.locations,
      objectTypes: renter.renterFiltersEntity.objectType,
      priceRange: renter.renterFiltersEntity.priceRangeStart
        ? ([renter.renterFiltersEntity.priceRangeStart, renter.renterFiltersEntity.priceRangeEnd] as [
            number,
            number,
          ])
        : null,
    };

    return entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .findMatchesForRenterToObjects(renter, matchOptions);
  }
}
