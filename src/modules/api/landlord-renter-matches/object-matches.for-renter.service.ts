import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { RenterEntity } from '../../../entities/renters/Renter.entity';
import { SubwayStationsRepository } from '../../../repositories/directories/subwayStations.repository';
import { LocationsRepository } from '../../../repositories/directories/locations.repository';
import { LandlordObjectsRepository } from '../../../repositories/landlord-objects/landlord-objects.repository';
import {
  LandlordObjectEntity,
  PreferredGenderEnumType,
} from '../../../entities/landlord-objects/LandlordObject.entity';
import { LandlordObjectRenterMatchesRepository } from '../../../repositories/matches/landlordObjectRenterMatches';
import { GenderEnumType } from '../renters/renters.type';
import { RentersRepository } from '../../../repositories/users/renters.repository';
import { MatchStatusEnumType } from '../renter-matches/renter-matches.type';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { MONEY_RANGE_DIFF } from '../../../repositories/directories/moneyRanges.repository';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { QueueApproveAdminObjectProducerService } from '../../queues/approve-admin-object/producers/queue-approve-admin-object.producer.service';
import { RentersService } from '../renters/renters.service';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { ChangeRenterStatusOfObjectDto } from './dto/ChangeRenterStatusOfObjectDto';

@Injectable()
export class ObjectMatchesForRenterService {
  constructor(
    private logger: Logger,
    private entityManager: EntityManager,
    private flowXoService: FlowXoService,

    private telegramBotService: TelegramBotService,
    private rentersService: RentersService,
    private landlordObjectsService: LandlordObjectsService,
    private queueApproveAdminObjectService: QueueApproveAdminObjectProducerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async matchRenterToObjects(renterId: string): Promise<void> {
    const renter = await this.rentersService.getRenter(renterId);

    const matchedObjects = await this.findMatchesForRenter(renter);
    if (!matchedObjects.length) {
      return;
    }

    await this.entityManager
      .getCustomRepository(LandlordObjectRenterMatchesRepository)
      .createMatchesForRenter(renter, matchedObjects);
  }

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
      await this.queueApproveAdminObjectService.setApproveAdminObject(renter.id, landlordObject.id);
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
