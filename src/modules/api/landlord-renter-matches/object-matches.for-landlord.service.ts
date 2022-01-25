import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { RenterEntity } from '../renters/entities/Renter.entity';
import { RentersRepository } from '../renters/repositories/renters.repository';
import { SubwayStationsRepository } from '../directories/repositories/subwayStations.repository';
import { MoneyRangesRepository } from '../directories/repositories/moneyRanges.repository';
import { LocationsRepository } from '../directories/repositories/locations.repository';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import {
  LandlordObjectEntity,
  PreferredGenderEnumType,
} from '../landlord-objects/entities/LandlordObject.entity';
import { GenderEnumType } from '../renters/interfaces/renters.type';
import { MatchStatusEnumType } from '../renter-matches/interfaces/renter-matches.type';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { RentersService } from '../renters/renters.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { LandlordObjectRenterMatchesRepository } from './repositories/landlordObjectRenterMatches';
import { ChangeLandlordStatusOfObjectDto } from './dto/ChangeLandlordStatusOfObjectDto';
import { SetRenterLastInLandlordQueueDto } from './dto/SetRenterLastInLandlordQueue.dto';

@Injectable()
export class ObjectMatchesForLandlordService {
  constructor(
    private logger: LoggerService,
    private entityManager: EntityManager,

    private flowXoService: FlowXoService,
    private landlordObjectsService: LandlordObjectsService,
    private rentersService: RentersService,
    private tasksSchedulerService: TasksSchedulerService,
    private telegramBotService: TelegramBotService,
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

  public async matchObjectToRenters(landlordObject: LandlordObjectEntity): Promise<void> {
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

  public async setRenterLastInLandlordQueue(
    setRenterLastInLandlordQueueDto: SetRenterLastInLandlordQueueDto,
  ): Promise<void> {
    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .setRenterLastInLandlordQueue(
        setRenterLastInLandlordQueueDto.renterId,
        setRenterLastInLandlordQueueDto.landlordObjectId,
      );
  }

  public async getPaidContacts(renterId: string, landlordObjectId: string): Promise<string> {
    const landlordObject = await this.landlordObjectsService.getLandlordObject(landlordObjectId);
    const isPublishedByAdmins = await this.isObjectPublishedByAdmins(landlordObject);
    // todo если не админ - просто убирать из списка у лендлорда этого чела
    if (isPublishedByAdmins) {
      await this.tasksSchedulerService.removeAdminApproveObject({
        renterId: renterId,
        landlordObjectId: landlordObjectId,
      });
    }

    await this.rentersService.removeContact(renterId);
    return this.flowXoService.formContactsMessageOfLandlord(landlordObject);
  }

  private async isObjectPublishedByAdmins(landlordObject: LandlordObjectEntity): Promise<boolean> {
    const { chatId: adminChatId } = await this.telegramBotService.getAdmin();
    const { chatId: subAdminChatId } = await this.telegramBotService.getSubAdmin();
    return (
      adminChatId === landlordObject.telegramUser.chatId ||
      subAdminChatId === landlordObject.telegramUser.chatId
    );
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
