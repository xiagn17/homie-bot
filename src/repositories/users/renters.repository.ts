import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Renter } from '../../entities/users/Renter';
import { SubwayStation } from '../../entities/directories/SubwayStation';
import { Interest } from '../../entities/directories/Interest';
import { WithAnotherGenderEnumType } from '../../modules/renters/renters.type';

interface RelationDataType {
  subwayStations: SubwayStation[];
  interests: Interest[];
}
@EntityRepository(Renter)
export class RentersRepository extends Repository<Renter> {
  async createWithRelations(
    renterData: Partial<Renter>,
    { subwayStations, interests }: RelationDataType,
  ): Promise<Renter> {
    const renter = await this.save(this.create(renterData));

    await this.createQueryBuilder('renter').relation('subwayStations').of(renter.id).add(subwayStations);
    await this.createQueryBuilder('renter').relation('interests').of(renter.id).add(interests);

    return this.getFullRenter(renter.id);
  }

  getFullRenter(renterId: string): Promise<Renter> {
    const renterQb = this.createQueryBuilder('renter').where('renter.id = :renterId', {
      renterId: renterId,
    });
    return this.getWithRelationsQb(renterQb).getOneOrFail();
  }

  getByChatId(chatId: string): Promise<Renter | undefined> {
    const renterQb = this.createQueryBuilder('renter').where('telegramUser.chatId = :chatId', {
      chatId: chatId,
    });
    return this.getWithRelationsQb(renterQb).getOne();
  }

  getWithRelationsQb(renterQb: SelectQueryBuilder<Renter>): SelectQueryBuilder<Renter> {
    return renterQb
      .innerJoinAndSelect('renter.subwayStations', 'subwayStation')
      .innerJoinAndSelect('renter.location', 'location')
      .innerJoinAndSelect('renter.moneyRange', 'moneyRange')
      .innerJoinAndSelect('renter.telegramUser', 'telegramUser')
      .leftJoinAndSelect('renter.interests', 'interest');
  }

  async getChatId(renterId: string): Promise<string> {
    return (
      await this.createQueryBuilder('renter')
        .where('renter.id = :renterId', {
          renterId: renterId,
        })
        .innerJoinAndSelect('renter.telegramUser', 'telegramUser')
        .getOneOrFail()
    ).telegramUser.chatId;
  }

  findMatchesForRenter(
    renter: Renter,
    matchOptions: {
      moneyRangeIds: string[];
      locationIds: string[];
      subwayStationIds: string[];
      renterIdsToExclude: string[];
    },
  ): Promise<Renter[]> {
    const rentersQuery = this.createQueryBuilder('renter')
      .where('renter.id != ANY (:renterIds)', {
        renterIds: matchOptions.renterIdsToExclude,
      })
      .innerJoin('renter.matchesInfo', 'matchesInfo', 'matchesInfo.inSearch = true');

    if (renter.liveWithAnotherGender === WithAnotherGenderEnumType.not) {
      rentersQuery.andWhere('renter.gender = :gender', {
        gender: renter.gender,
      });
    } else if (renter.liveWithAnotherGender === WithAnotherGenderEnumType.yes) {
      rentersQuery.andWhere(
        '(renter.gender != :gender AND renter.liveWithAnotherGender = :anotherGender OR renter.gender = :gender)',
        {
          gender: renter.gender,
          anotherGender: WithAnotherGenderEnumType.yes,
        },
      );
    }

    const age = new Date().getFullYear() - Number(renter.birthdayYear);
    const birthdayYearOfThirtyYearsOld = new Date().getFullYear() - 30;
    if (age < 30) {
      rentersQuery.andWhere('renter.birthdayYear > :thirtyYear', {
        thirtyYear: birthdayYearOfThirtyYearsOld,
      });
    } else {
      rentersQuery.andWhere('renter.birthdayYear <= :thirtyYear', {
        thirtyYear: birthdayYearOfThirtyYearsOld,
      });
    }

    const weekBefore = new Date(
      new Date(renter.plannedArrival).setDate(new Date(renter.plannedArrival).getDate() - 7),
    );
    const weekAfter = new Date(
      new Date(renter.plannedArrival).setDate(new Date(renter.plannedArrival).getDate() + 7),
    );
    rentersQuery.andWhere('renter.plannedArrival >= :weekBefore AND renter.plannedArrival <= :weekAfter', {
      weekBefore: weekBefore.toISOString(),
      weekAfter: weekAfter.toISOString(),
    });

    if (matchOptions.locationIds.length !== 0) {
      rentersQuery.andWhere('renter.locationId = ANY (:locationIds)', {
        locationIds: matchOptions.locationIds,
      });
    }
    rentersQuery.innerJoin('renter.moneyRange', 'moneyRange', `moneyRange.id = ANY (:moneyRangeIds)`, {
      moneyRangeIds: matchOptions.moneyRangeIds,
    });
    if (matchOptions.subwayStationIds.length !== 0) {
      rentersQuery.leftJoin('renter.subwayStations', 'subway', `subway.id = ANY (:subwayStationIds)`, {
        subwayStationIds: matchOptions.subwayStationIds,
      });
    }

    return rentersQuery.getMany();
  }
}
