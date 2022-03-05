import { EntityNotFoundError, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { LandlordObjectEntity, PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { RenterEntity } from '../../renters/entities/Renter.entity';
import { LocationsEnum, ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';

@EntityRepository(LandlordObjectEntity)
export class LandlordObjectsRepository extends Repository<LandlordObjectEntity> {
  async createWithRelations(
    landlordObjectData: Partial<LandlordObjectEntity>,
  ): Promise<LandlordObjectEntity> {
    const landlordObjectEntity = await this.save(this.create(landlordObjectData));

    return this.findOneOrFail(landlordObjectEntity.id);
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
      .innerJoinAndSelect('landlordObject.telegramUser', 'telegramUser')
      .innerJoinAndSelect('landlordObject.photos', 'photos');
  }

  findMatchesForRenterToObjects(
    _renter: RenterEntity,
    matchOptions: {
      preferredGender: PreferredGenderEnumType[];
      locations: LocationsEnum[] | null;
      objectTypes: ObjectTypeEnum[] | null;
      priceRange: [number, number] | null;
      excludedObjectIds: string[];
    },
  ): Promise<LandlordObjectEntity[]> {
    const objectsQuery = this.createQueryBuilder('object');
    objectsQuery.where(
      `(object.isApproved = true AND object.archivedAt IS NULL AND object.updated_at > now() - (interval '2 days'))`,
    );
    objectsQuery.andWhere('object.preferredGender = ANY (:preferredGender)', {
      preferredGender: matchOptions.preferredGender,
    });

    if (matchOptions.excludedObjectIds.length) {
      objectsQuery.andWhere('(object.id NOT IN (:...excludedObjectIds))', {
        excludedObjectIds: matchOptions.excludedObjectIds,
      });
    }
    if (matchOptions.priceRange) {
      objectsQuery.andWhere(
        '(object.price::int >= :priceRangeStart AND object.price::int <= :priceRangeEnd)',
        {
          priceRangeStart: matchOptions.priceRange[0],
          priceRangeEnd: matchOptions.priceRange[1],
        },
      );
    }

    if (matchOptions.objectTypes?.length) {
      objectsQuery.andWhere('object.objectType = ANY (:types)', {
        types: matchOptions.objectTypes,
      });
    }
    if (matchOptions.locations?.length) {
      objectsQuery.andWhere('object.location = ANY (:locations)', {
        locations: matchOptions.locations,
      });
    }

    return objectsQuery.getMany();
  }
}