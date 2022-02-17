import { DeepPartial, EntityRepository, InsertResult, Repository } from 'typeorm';
import { RenterEntity } from '../../renters/entities/Renter.entity';
import { LandlordObjectRenterMatchEntity } from '../entities/LandlordObjectRenterMatch.entity';
import { LandlordObjectEntity } from '../../landlord-objects/entities/LandlordObject.entity';
import { MatchStatusEnumType } from '../interfaces/landlord-renter-matches.types';

interface CountOfUnprocessedObjectsByRentersRawDataType {
  renterId: string;
  count: number;
}

interface NextLandlordObjectRawDataType {
  landlordObjectId: string;
}

interface NextRenterRawDataType {
  renterId: string;
}

@EntityRepository(LandlordObjectRenterMatchEntity)
export class LandlordObjectRenterMatchesRepository extends Repository<LandlordObjectRenterMatchEntity> {
  createMatchesForObject(
    landlordObject: LandlordObjectEntity,
    renters: RenterEntity[],
  ): Promise<InsertResult> {
    const insertValues: DeepPartial<LandlordObjectRenterMatchEntity>[] = renters.map(r => ({
      renterId: r.id,
      landlordObjectId: landlordObject.id,
      renterStatus: MatchStatusEnumType.processing,
      paid: false,
      landlordStatus: null,
      updatedAt: new Date(),
    }));

    return this.createQueryBuilder().insert().values(insertValues).execute();
  }

  createMatchesForRenter(
    renter: RenterEntity,
    landlordObjects: LandlordObjectEntity[],
  ): Promise<InsertResult> {
    const insertValues: DeepPartial<LandlordObjectRenterMatchEntity>[] = landlordObjects.map(lo => ({
      renterId: renter.id,
      landlordObjectId: lo.id,
      renterStatus: MatchStatusEnumType.processing,
      paid: false,
      landlordStatus: null,
      updatedAt: new Date(),
    }));

    return this.createQueryBuilder().insert().values(insertValues).execute();
  }

  getCountOfUnprocessedObjectsByRenters(
    renterIds: string[],
  ): Promise<CountOfUnprocessedObjectsByRentersRawDataType[]> {
    const renterIdsString: string = renterIds.join("', '");
    return this.query(
      `
        SELECT renter_id as "renterId", COUNT(match_id)::integer AS "count" FROM landlord_object_renter_matches
        WHERE renter_id IN ('${renterIdsString}')
        AND renter_status = '${MatchStatusEnumType.processing}'
        AND paid = false
        GROUP BY renter_id;
    `,
    ) as Promise<CountOfUnprocessedObjectsByRentersRawDataType[]>;
  }

  async deleteUnprocessedObjectsForRenter(renterId: string): Promise<void> {
    await this.delete({ renterId: renterId, renterStatus: MatchStatusEnumType.processing, paid: false });
  }

  async getAllObjectIdsForRenter(renterId: string): Promise<string[]> {
    const data: { landlordObjectId: string }[] = await this.query(`
        SELECT landlord_object_id as "landlordObjectId"
            FROM landlord_object_renter_matches
            WHERE renter_id = '${renterId}'
    `);
    return data.map(({ landlordObjectId }) => landlordObjectId);
  }

  async getNextObjectIdForRenter(renterId: string): Promise<string | undefined> {
    const result: [NextLandlordObjectRawDataType] | [] = await this.query(`
        WITH renter_matches AS (
            SELECT
                   match_id,
                   renter_id,
                   landlord_object_id
            FROM landlord_object_renter_matches
            WHERE renter_id = '${renterId}'
              AND renter_status = '${MatchStatusEnumType.processing}'
              AND paid = false
        )
        SELECT
               landlord_object_id as "landlordObjectId"
        FROM landlord_objects t_landlordObjects
        JOIN renter_matches USING (landlord_object_id)
        WHERE t_landlordObjects.landlord_object_id = renter_matches.landlord_object_id
          AND t_landlordObjects.archived_at IS NULL
        ORDER BY t_landlordObjects.created_at
        LIMIT 1
    `);
    // todo !!! вернуть назад перед мержем в мастер
    //  AND t_landlordObjects.updated_at > now() - (interval '2 days')
    return result[0]?.landlordObjectId;
  }

  async getNextRenterIdForLandlord(landlordObjectId: string): Promise<string | undefined> {
    const result: [NextRenterRawDataType] | [] = await this.query(`
        SELECT
            renter_id as "renterId"
        FROM landlord_object_renter_matches
        WHERE landlord_object_id = '${landlordObjectId}'
          AND renter_status = '${MatchStatusEnumType.resolved}'
          AND paid = false
          AND landlord_status = '${MatchStatusEnumType.processing}'
        ORDER BY updated_at
        LIMIT 1
    `);

    return result[0]?.renterId;
  }

  async getObjectIdWithUnresolvedRenters(chatId: string): Promise<string | undefined> {
    const result: NextLandlordObjectRawDataType[] = await this.query(`
        SELECT
            landlord_objects.landlord_object_id as "landlordObjectId"
        FROM landlord_objects
        INNER JOIN telegram_users tu on landlord_objects.telegram_user_id = tu.telegram_user_id
        INNER JOIN landlord_object_renter_matches lorm on landlord_objects.landlord_object_id = lorm.landlord_object_id
        WHERE tu.chat_id = '${chatId}'
          AND renter_status = '${MatchStatusEnumType.resolved}'
          AND landlord_status = '${MatchStatusEnumType.processing}'
          AND landlord_objects.archived_at IS NULL
        ORDER BY landlord_objects.updated_at
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

  async markAsPaidMatch(renterId: string, landlordObjectId: string): Promise<void> {
    await this.createQueryBuilder()
      .update(LandlordObjectRenterMatchEntity)
      .set({
        updatedAt: new Date(),
        paid: true,
      })
      .where('renterId = :renterId AND landlordObjectId = :landlordObjectId', {
        renterId: renterId,
        landlordObjectId: landlordObjectId,
      })
      .execute();
  }

  async setRenterLastInLandlordQueue(renterId: string, landlordObjectId: string): Promise<void> {
    await this.createQueryBuilder()
      .update(LandlordObjectRenterMatchEntity)
      .set({
        updatedAt: new Date(),
      })
      .where('renterId = :renterId AND landlordObjectId = :landlordObjectId', {
        renterId: renterId,
        landlordObjectId: landlordObjectId,
      })
      .execute();
  }
}
