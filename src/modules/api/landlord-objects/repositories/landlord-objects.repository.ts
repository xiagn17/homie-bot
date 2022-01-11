import { EntityNotFoundError, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { SubwayStationEntity } from '../../directories/entities/SubwayStation.entity';
import { LandlordObjectEntity, PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { RenterEntity } from '../../renters/entities/Renter.entity';

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

  async getNextObjectIdToApprove(): Promise<string | undefined> {
    const result: [{ landlordObjectId: string }] | [] = await this.query(`
        SELECT
            landlord_object_id as "landlordObjectId"
        FROM landlord_objects
        WHERE archived_at IS NULL
          AND is_approved = false
        ORDER BY created_at
        LIMIT 1
    `);

    return result[0]?.landlordObjectId;
  }

  async approveObject(id: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        isApproved: true,
        updatedAt: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  async archiveObject(id: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        archivedAt: new Date(),
      })
      .where('id = :id', { id })
      .execute();
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

  async getByChatId(chatId: string): Promise<LandlordObjectEntity[]> {
    const renterQb = this.createQueryBuilder('landlordObject')
      .where('telegramUser.chatId = :chatId', {
        chatId: chatId,
      })
      .andWhere('landlordObject.archivedAt IS NULL');
    const landlordObjectEntities = await this.getWithRelationsQb(renterQb).getMany();
    if (!landlordObjectEntities[0]) {
      throw new EntityNotFoundError(LandlordObjectEntity, { chatId });
    }
    return landlordObjectEntities;
  }

  async renewObject(id: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        updatedAt: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  getWithRelationsQb(
    landlordObjectQb: SelectQueryBuilder<LandlordObjectEntity>,
  ): SelectQueryBuilder<LandlordObjectEntity> {
    return landlordObjectQb
      .innerJoinAndSelect('landlordObject.subwayStations', 'subwayStation')
      .innerJoinAndSelect('landlordObject.location', 'location')
      .innerJoinAndSelect('landlordObject.telegramUser', 'telegramUser')
      .innerJoinAndSelect('landlordObject.photos', 'photos');
  }

  findMatchesForRenterToObjects(
    renter: RenterEntity,
    matchOptions: {
      priceRange: [number, number];
      locationIds: string[];
      subwayStationIds: string[];
      preferredGender: PreferredGenderEnumType[];
    },
  ): Promise<LandlordObjectEntity[]> {
    const objectsQuery = this.createQueryBuilder('object');

    const renterAge = new Date().getFullYear() - renter.birthdayYear;
    const ageRangeStart = renterAge - 10;
    const ageRangeEnd = renterAge + 10;
    objectsQuery.where('(object.averageAge >= :ageRangeStart AND object.averageAge <= :ageRangeEnd)', {
      ageRangeStart: ageRangeStart,
      ageRangeEnd: ageRangeEnd,
    });
    objectsQuery.andWhere('(object.isApproved = true AND object.archivedAt IS NULL)');

    if (renter.withAnimals) {
      objectsQuery.andWhere('object.showWithAnimals = :showWithAnimals', { showWithAnimals: true });
    }

    objectsQuery.andWhere('object.preferredGender = ANY (:preferredGender)', {
      preferredGender: matchOptions.preferredGender,
    });

    objectsQuery.andWhere('(object.price >= :priceRangeStart AND object.price <= :priceRangeEnd)', {
      priceRangeStart: matchOptions.priceRange[0],
      priceRangeEnd: matchOptions.priceRange[1],
    });

    if (matchOptions.locationIds.length) {
      objectsQuery.andWhere('object.locationId = ANY (:locationIds)', {
        locationIds: matchOptions.locationIds,
      });
    }
    if (matchOptions.subwayStationIds.length) {
      objectsQuery.leftJoin('object.subwayStations', 'subway', `subway.id = ANY (:subwayStationIds)`, {
        subwayStationIds: matchOptions.subwayStationIds,
      });
    }

    return objectsQuery.getMany();
  }
}
