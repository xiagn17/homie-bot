import { Injectable } from '@nestjs/common';
import { EntityManager, LessThanOrEqual, MoreThan, FindConditions, Equal, Not, Any } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { Renter } from '../../entities/users/Renter';
import { MatchedRenters } from '../../entities/matched/MatchedRenters';
import { Location } from '../../entities/directories/Location';
import { LocationEnumType } from '../tilda-form/tilda-form.types';

@Injectable()
export class MatchRentersService {
  constructor(private logger: Logger, private entityManager: EntityManager) {
    this.logger.setContext(this.constructor.name);
  }

  async createMatchesForRenter(
    renter: Renter,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    const age = new Date().getFullYear() - Number(renter.birthdayYear);
    const birthdayYearOfThirtyYearsOld = new Date().getFullYear() - 30;

    const nevermindLocation = await entityManager
      .getRepository(Location)
      .findOneOrFail({ area: LocationEnumType.nevermind });

    const conditions: FindConditions<Renter> = {
      id: Not(renter.id),
      gender: Equal(renter.gender),
    };

    if (renter.locationId !== nevermindLocation.id) {
      conditions.locationId = Any([renter.locationId, nevermindLocation.id]);
    }
    if (age < 30) {
      conditions.birthdayYear = MoreThan(birthdayYearOfThirtyYearsOld);
    } else {
      conditions.birthdayYear = LessThanOrEqual(birthdayYearOfThirtyYearsOld);
    }

    const rentersForMatch = await entityManager.getRepository(Renter).find(conditions);
    const matchedRenters: Partial<MatchedRenters>[] = rentersForMatch.map(renterForMatch => ({
      firstId: renter.id,
      secondId: renterForMatch.id,
    }));
    await entityManager.getRepository(MatchedRenters).insert(matchedRenters);
  }

  async deleteAllMatchesByRenterId(renterId: string): Promise<void> {
    await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(MatchedRenters)
      .where('firstId = :id OR secondId = :id', { id: renterId })
      .execute();
  }
}
