import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { RenterEntity } from '../../entities/users/Renter.entity';
import { SubwayStation } from '../../entities/directories/SubwayStation';
import { Interest } from '../../entities/directories/Interest';
import { WithAnotherGenderEnumType } from '../../modules/api/renters/renters.type';

interface RelationDataType {
  subwayStations: SubwayStation[];
  interests: Interest[];
}
@EntityRepository(RenterEntity)
export class RentersRepository extends Repository<RenterEntity> {
  async createWithRelations(
    renterData: Partial<RenterEntity>,
    { subwayStations, interests }: RelationDataType,
  ): Promise<RenterEntity> {
    const renter = await this.save(this.create(renterData));

    await this.createQueryBuilder('renter').relation('subwayStations').of(renter.id).add(subwayStations);
    await this.createQueryBuilder('renter').relation('interests').of(renter.id).add(interests);

    return this.getFullRenter(renter.id);
  }

  getFullRenter(renterId: string): Promise<RenterEntity> {
    const renterQb = this.createQueryBuilder('renter').where('renter.id = :renterId', {
      renterId: renterId,
    });
    return this.getWithRelationsQb(renterQb).getOneOrFail();
  }

  getByChatId(chatId: string): Promise<RenterEntity | undefined> {
    const renterQb = this.createQueryBuilder('renter').where('telegramUser.chatId = :chatId', {
      chatId: chatId,
    });
    return this.getWithRelationsQb(renterQb).getOne();
  }

  getByPhone(phoneNumber: string): Promise<RenterEntity | undefined> {
    return this.getWithRelationsQb(
      this.createQueryBuilder('renter').where('renter.phoneNumber = :phoneNumber', { phoneNumber }),
    ).getOne();
  }

  getWithRelationsQb(renterQb: SelectQueryBuilder<RenterEntity>): SelectQueryBuilder<RenterEntity> {
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
    renter: RenterEntity,
    matchOptions: {
      moneyRangeIds: string[];
      locationIds: string[];
      subwayStationIds: string[];
      renterIdsToExclude: string[];
    },
  ): Promise<RenterEntity[]> {
    const rentersQuery = this.createQueryBuilder('renter')
      .where('renter.id NOT IN (:...renterIds)', {
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
