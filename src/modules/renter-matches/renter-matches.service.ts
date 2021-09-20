import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { Renter } from '../../entities/users/Renter';
import { RenterMatch } from '../../entities/matched/RenterMatch';
import { RenterMatchesRepository } from '../../repositories/matched/renterMatches.repository';
import { RentersRepository } from '../../repositories/users/renters.repository';
import { SubwayStationsRepository } from '../../repositories/directories/subwayStations.repository';
import { MoneyRangesRepository } from '../../repositories/directories/moneyRanges.repository';
import { LocationsRepository } from '../../repositories/directories/locations.repository';
import { TelegramUsersRepository } from '../../repositories/users/telegramUsers.repository';

// todo matching
// 0.1 после заполнения формы попытаться сфетчить метч(в цепочке) - проставить ему status = processing и скинуть назад информацию RenterType
// 0.2 через sendpulse api отправить второму человеку цепочку с RenterType первого
// 3. Затем писать в цепочке
// "Когда вы спишитесь и сойдетесь или разойдетесь - уведомите (нажать на кнопку ниже). Единовременно можно искать только одного соседа"
// 3.1 После кнопки поставить status = resolve | reject и предложить найти еще одного соседа

@Injectable()
export class RenterMatchesService {
  constructor(private logger: Logger, private entityManager: EntityManager) {
    this.logger.setContext(this.constructor.name);
  }

  async createMatchesForRenter(
    renter: Renter,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    const subwayStationIdsForMatch = await entityManager
      .getCustomRepository(SubwayStationsRepository)
      .getRenterStationIdsForMatch(renter.subwayStations);
    const moneyRangeIdsForMatch = await entityManager
      .getCustomRepository(MoneyRangesRepository)
      .getMoneyRangeIdsForMatch(renter.moneyRange);
    const locationIdsForMatch = await entityManager
      .getCustomRepository(LocationsRepository)
      .getRenterLocationIdsForMatch(renter.location);

    const matchOptions = {
      moneyRangeIds: moneyRangeIdsForMatch,
      locationIds: locationIdsForMatch,
      subwayStationIds: subwayStationIdsForMatch,
    };

    const matchedRenters = await entityManager
      .getCustomRepository(RentersRepository)
      .findMatchesForRenter(renter, matchOptions);

    await entityManager.getCustomRepository(RenterMatchesRepository).insertMatches(renter, matchedRenters);
  }

  async getMatchForRenter(userChatId: string): Promise<RenterMatch | undefined> {
    const telegramUser = await this.entityManager
      .getCustomRepository(TelegramUsersRepository)
      .getUserByChatId(userChatId);
    const match = await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .getAbleMatch(telegramUser.renter.id);
    if (!match) {
      return undefined;
    }
    const processingMatch = await this.entityManager
      .getCustomRepository(RenterMatchesRepository)
      .startProcessingMatch(match);
    return processingMatch;
  }

  async deleteAbleMatchesOfRenter(renterId: string): Promise<void> {
    await this.entityManager.getCustomRepository(RenterMatchesRepository).deleteAbleMatches(renterId);
  }
}
