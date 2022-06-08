import { DeepPartial, EntityRepository, InsertResult, Repository } from 'typeorm';
import { RenterEntity } from '../../renters/entities/Renter.entity';
import { LandlordObjectRenterMatchEntity } from '../entities/LandlordObjectRenterMatch.entity';
import { LandlordObjectEntity } from '../../landlord-objects/entities/LandlordObject.entity';
import { MatchStatusEnumType } from '../interfaces/landlord-renter-matches.types';
import { RenterIdsDataRaw } from '../../renters/repositories/renters.repository';
import { LandlordObjectIdsDataRaw } from '../../landlord-objects/repositories/landlord-objects.repository';

interface NextLandlordObjectRawDataType {
  landlordObjectId: string;
}

@EntityRepository(LandlordObjectRenterMatchEntity)
export class LandlordObjectRenterMatchesRepository extends Repository<LandlordObjectRenterMatchEntity> {
  createMatchesForObject(
    landlordObject: LandlordObjectEntity,
    renters: RenterIdsDataRaw[],
  ): Promise<InsertResult> {
    const insertValues: DeepPartial<LandlordObjectRenterMatchEntity>[] = renters.map(r => ({
      renterId: r.renterId,
      landlordObjectId: landlordObject.id,
      renterStatus: MatchStatusEnumType.processing,
      landlordStatus: null,
      updatedAt: new Date(),
    }));

    return this.createQueryBuilder().insert().values(insertValues).execute();
  }

  createMatchesForRenter(
    renter: RenterEntity,
    landlordObjects: LandlordObjectIdsDataRaw[],
  ): Promise<InsertResult> {
    const insertValues: DeepPartial<LandlordObjectRenterMatchEntity>[] = landlordObjects.map(lo => ({
      renterId: renter.id,
      landlordObjectId: lo.landlordObjectId,
      renterStatus: MatchStatusEnumType.processing,
      landlordStatus: null,
      updatedAt: new Date(),
    }));

    return this.createQueryBuilder().insert().values(insertValues).execute();
  }

  async deleteUnprocessedObjectsForRenter(renterId: string): Promise<void> {
    await this.delete({ renterId: renterId, renterStatus: MatchStatusEnumType.processing });
  }

  async deleteUnprocessedRentersForObject(landlordObjectId: string): Promise<void> {
    await this.delete({
      landlordObjectId: landlordObjectId,
      renterStatus: MatchStatusEnumType.processing,
    });
  }

  async getAllObjectIdsForRenter(renterId: string): Promise<string[]> {
    const data: { landlordObjectId: string }[] = await this.query(`
        SELECT landlord_object_id as "landlordObjectId"
        FROM landlord_object_renter_matches
        WHERE renter_id = '${renterId}'
    `);
    return data.map(({ landlordObjectId }) => landlordObjectId);
  }

  async getAllRenterIdsForObject(landlordObjectId: string): Promise<string[]> {
    const data: { renterId: string }[] = await this.query(`
        SELECT renter_id as "renterId"
        FROM landlord_object_renter_matches
        WHERE landlord_object_id = '${landlordObjectId}'
    `);
    return data.map(({ renterId }) => renterId);
  }

  async getNextObjectIdForRenter(renterId: string): Promise<string | undefined> {
    const result: [NextLandlordObjectRawDataType] | [] = await this.query(`
        WITH renter_matches AS (
            SELECT match_id,
                   renter_id,
                   landlord_object_id
            FROM landlord_object_renter_matches
            WHERE renter_id = '${renterId}'
              AND renter_status = '${MatchStatusEnumType.processing}'
        )
        SELECT landlord_object_id as "landlordObjectId"
        FROM landlord_objects t_landlordObjects
                 JOIN renter_matches USING (landlord_object_id)
        WHERE t_landlordObjects.landlord_object_id = renter_matches.landlord_object_id
          AND t_landlordObjects.stopped_at IS NULL
        ORDER BY t_landlordObjects.starred DESC, t_landlordObjects.created_at
        LIMIT 1
    `);

    return result[0]?.landlordObjectId;
  }

  async changeRenterStatus(
    renterId: string,
    landlordObjectId: string,
    renterStatus: MatchStatusEnumType,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(LandlordObjectRenterMatchEntity)
      .set({
        renterStatus: renterStatus,
        landlordStatus: MatchStatusEnumType.processing,
        updatedAt: new Date(),
      })
      .where('renterId = :renterId AND landlordObjectId = :landlordObjectId', {
        renterId: renterId,
        landlordObjectId: landlordObjectId,
      })
      .execute();
  }

  async changeLandlordStatus(
    renterId: string,
    landlordObjectId: string,
    landlordStatus: MatchStatusEnumType,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(LandlordObjectRenterMatchEntity)
      .set({
        landlordStatus: landlordStatus,
        updatedAt: new Date(),
      })
      .where('renterId = :renterId AND landlordObjectId = :landlordObjectId', {
        renterId: renterId,
        landlordObjectId: landlordObjectId,
      })
      .execute();
  }
}
