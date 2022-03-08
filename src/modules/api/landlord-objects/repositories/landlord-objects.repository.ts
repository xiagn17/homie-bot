import { EntityNotFoundError, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { LandlordObjectEntity, PreferredGenderEnumType } from '../entities/LandlordObject.entity';
import { RenterEntity } from '../../renters/entities/Renter.entity';
import { LocationsEnum, ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';
import { OBJECT_ACTIVE_TIME_DAYS } from '../constants/landlord-object-active-time.constant';

export interface LandlordObjectIdsDataRaw {
  landlordObjectId: string;
}

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

  async stopObject(id: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        stoppedAt: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  async deleteObject(id: string): Promise<void> {
    await this.delete(id);
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

  async getByChatId(chatId: string): Promise<LandlordObjectEntity> {
    const renterQb = this.createQueryBuilder('landlordObject')
      .where('telegramUser.chatId = :chatId', {
        chatId: chatId,
      })
      .orderBy({
        number: 'DESC',
      });
    const landlordObjectEntities = await this.getWithRelationsQb(renterQb).getMany();

    const object = landlordObjectEntities[0];
    if (!object) {
      throw new EntityNotFoundError(LandlordObjectEntity, { chatId });
    }
    return object;
  }

  async renewObject(id: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        updatedAt: new Date(),
        stoppedAt: null,
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
  ): Promise<LandlordObjectIdsDataRaw[]> {
    const preferredGenderString = matchOptions.preferredGender.join(', ');
    let query: string = `
        SELECT o.landlord_object_id as "landlordObjectId" FROM landlord_objects o
        WHERE (o.is_approved = true AND o.stopped_at IS NULL AND o.updated_at > now() - (interval '${OBJECT_ACTIVE_TIME_DAYS} days'))
            AND o.preferred_gender = ANY ('{${preferredGenderString}}')
    `;

    if (matchOptions.excludedObjectIds.length) {
      const excludedObjectIdsString = matchOptions.excludedObjectIds.join(`', '`);
      const text = `
          AND o.landlord_object_id NOT IN ('${excludedObjectIdsString}')
      `;
      query += text;
    }
    if (matchOptions.priceRange) {
      const text = `
          AND (o.price::int >= ${matchOptions.priceRange[0]} AND o.price::int <= ${matchOptions.priceRange[1]})
      `;
      query += text;
    }
    if (matchOptions.objectTypes?.length) {
      const objectTypesString = matchOptions.objectTypes.join(', ');
      const text = `
          AND o.object_type = ANY ('{${objectTypesString}}')
      `;
      query += text;
    }
    if (matchOptions.locations?.length) {
      const locationsString = matchOptions.locations.join(', ');
      const text = `
          AND o.location = ANY ('{${locationsString}}')
      `;
      query += text;
    }

    return this.query(query);
  }
}
