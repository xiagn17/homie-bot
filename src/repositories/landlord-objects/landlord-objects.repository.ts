import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { SubwayStationEntity } from '../../entities/directories/SubwayStation.entity';
import { LandlordObjectEntity } from '../../entities/landlord-objects/LandlordObject.entity';

interface RelationDataType {
  subwayStations: SubwayStationEntity[];
}
@EntityRepository(LandlordObjectEntity)
export class LandlordObjectsRepository extends Repository<LandlordObjectEntity> {
  async createWithRelations(
    landlordObjectData: Partial<LandlordObjectEntity>,
    { subwayStations }: RelationDataType,
  ): Promise<LandlordObjectEntity> {
    const landlordObjectEntity = await this.save(this.create(landlordObjectData));

    await this.createQueryBuilder('landlordObject')
      .relation('subwayStations')
      .of(landlordObjectEntity.id)
      .add(subwayStations);

    return landlordObjectEntity;
  }

  getFullObject(landlordObjectId: string): Promise<LandlordObjectEntity> {
    const landlordObjectQb = this.createQueryBuilder('landlordObject').where(
      'landlordObject.id = :landlordObjectId',
      {
        landlordObjectId,
      },
    );
    return this.getWithRelationsQb(landlordObjectQb).getOneOrFail();
  }
  //
  // getByChatId(chatId: string): Promise<RenterEntity | undefined> {
  //   const renterQb = this.createQueryBuilder('renter').where('telegramUser.chatId = :chatId', {
  //     chatId: chatId,
  //   });
  //   return this.getWithRelationsQb(renterQb).getOne();
  // }

  getWithRelationsQb(
    landlordObjectQb: SelectQueryBuilder<LandlordObjectEntity>,
  ): SelectQueryBuilder<LandlordObjectEntity> {
    return landlordObjectQb
      .innerJoinAndSelect('landlordObject.subwayStations', 'subwayStation')
      .innerJoinAndSelect('landlordObject.location', 'location')
      .innerJoinAndSelect('landlordObject.telegramUser', 'telegramUser')
      .innerJoinAndSelect('landlordObject.photos', 'photos');
  }

  // async getChatId(renterId: string): Promise<string> {
  //   return (
  //     await this.createQueryBuilder('renter')
  //       .where('renter.id = :renterId', {
  //         renterId: renterId,
  //       })
  //       .innerJoinAndSelect('renter.telegramUser', 'telegramUser')
  //       .getOneOrFail()
  //   ).telegramUser.chatId;
  // }
  //
  // findMatchesForRenter(
  //   renter: RenterEntity,
  //   matchOptions: {
  //     moneyRangeIds: string[];
  //     locationIds: string[];
  //     subwayStationIds: string[];
  //     renterIdsToExclude: string[];
  //   },
  // ): Promise<RenterEntity[]> {
  //   const rentersQuery = this.createQueryBuilder('renter')
  //     .where('renter.id NOT IN (:...renterIds)', {
  //       renterIds: matchOptions.renterIdsToExclude,
  //     })
  //     .innerJoin('renter.matchesInfo', 'matchesInfo', 'matchesInfo.inSearchMate = true');
  //
  //   if (renter.liveWithAnotherGender === WithAnotherGenderEnumType.not) {
  //     rentersQuery.andWhere('renter.gender = :gender', {
  //       gender: renter.gender,
  //     });
  //   } else if (renter.liveWithAnotherGender === WithAnotherGenderEnumType.yes) {
  //     rentersQuery.andWhere(
  //       '(renter.gender != :gender AND renter.liveWithAnotherGender = :anotherGender OR renter.gender = :gender)',
  //       {
  //         gender: renter.gender,
  //         anotherGender: WithAnotherGenderEnumType.yes,
  //       },
  //     );
  //   }
  //
  //   const age = new Date().getFullYear() - Number(renter.birthdayYear);
  //   const birthdayYearOfThirtyYearsOld = new Date().getFullYear() - 30;
  //   if (age < 30) {
  //     rentersQuery.andWhere('renter.birthdayYear > :thirtyYear', {
  //       thirtyYear: birthdayYearOfThirtyYearsOld,
  //     });
  //   } else {
  //     rentersQuery.andWhere('renter.birthdayYear <= :thirtyYear', {
  //       thirtyYear: birthdayYearOfThirtyYearsOld,
  //     });
  //   }
  //
  //   const weekBefore = new Date(
  //     new Date(renter.plannedArrival).setDate(new Date(renter.plannedArrival).getDate() - 7),
  //   );
  //   const weekAfter = new Date(
  //     new Date(renter.plannedArrival).setDate(new Date(renter.plannedArrival).getDate() + 7),
  //   );
  //   rentersQuery.andWhere('renter.plannedArrival >= :weekBefore AND renter.plannedArrival <= :weekAfter', {
  //     weekBefore: weekBefore.toISOString(),
  //     weekAfter: weekAfter.toISOString(),
  //   });
  //
  //   if (matchOptions.locationIds.length !== 0) {
  //     rentersQuery.andWhere('renter.locationId = ANY (:locationIds)', {
  //       locationIds: matchOptions.locationIds,
  //     });
  //   }
  //   rentersQuery.innerJoin('renter.moneyRange', 'moneyRange', `moneyRange.id = ANY (:moneyRangeIds)`, {
  //     moneyRangeIds: matchOptions.moneyRangeIds,
  //   });
  //   if (matchOptions.subwayStationIds.length !== 0) {
  //     rentersQuery.leftJoin('renter.subwayStations', 'subway', `subway.id = ANY (:subwayStationIds)`, {
  //       subwayStationIds: matchOptions.subwayStationIds,
  //     });
  //   }
  //
  //   return rentersQuery.getMany();
  // }
}
