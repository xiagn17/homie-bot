import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { RenterEntity } from '../renters/entities/Renter.entity';
import { SubwayStationsRepository } from '../directories/repositories/subwayStations.repository';
import { LocationsRepository } from '../directories/repositories/locations.repository';
import { LandlordObjectsRepository } from '../landlord-objects/repositories/landlord-objects.repository';
import {
  LandlordObjectEntity,
  PreferredGenderEnumType,
} from '../landlord-objects/entities/LandlordObject.entity';
import { GenderEnumType } from '../renters/interfaces/renters.type';
import { RentersRepository } from '../renters/repositories/renters.repository';
import { MatchStatusEnumType } from '../renter-matches/interfaces/renter-matches.type';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { MONEY_RANGE_DIFF } from '../directories/repositories/moneyRanges.repository';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { LandlordObjectRenterMatchesRepository } from './repositories/landlordObjectRenterMatches';
import { ChangeRenterStatusOfObjectDto } from './dto/ChangeRenterStatusOfObjectDto';

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

    const { chatId: adminChatId } = await this.telegramBotService.getAdmin();
    const { chatId: subAdminChatId } = await this.telegramBotService.getSubAdmin();
    if (
      adminChatId === landlordObject.telegramUser.chatId ||
      subAdminChatId === landlordObject.telegramUser.chatId
    ) {
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
    const subwayStationIdsForMatch = await entityManager
      .getCustomRepository(SubwayStationsRepository)
      .getStationIdsForMatch(renter.subwayStations);
    const locationIdsForMatch = await entityManager
      .getCustomRepository(LocationsRepository)
      .getLocationIdsForMatch(renter.location);

    const rangeStart = renter.moneyRange.range.split('-')[0];
    const rangeEnd = renter.moneyRange.range.split('-')[1];
    const priceRange: [number, number] = [
      Number(rangeStart) - MONEY_RANGE_DIFF,
      Number(rangeEnd) + MONEY_RANGE_DIFF,
    ];
    const preferredGender =
      renter.gender === GenderEnumType.MALE
        ? [PreferredGenderEnumType.MALE, PreferredGenderEnumType.NO_DIFFERENCE]
        : [PreferredGenderEnumType.FEMALE, PreferredGenderEnumType.NO_DIFFERENCE];

    const matchOptions = {
      priceRange: priceRange,
      preferredGender: preferredGender,
      locationIds: locationIdsForMatch,
      subwayStationIds: subwayStationIdsForMatch,
    };

    return entityManager
      .getCustomRepository(LandlordObjectsRepository)
      .findMatchesForRenterToObjects(renter, matchOptions);
  }
}
