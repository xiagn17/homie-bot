import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { RenterEntity } from '../entities/Renter.entity';
import { GenderEnumType } from '../interfaces/renters.type';
import { LandlordObjectEntity } from '../../landlord-objects/entities/LandlordObject.entity';
import { LocationsEnum, ObjectTypeEnum } from '../entities/RenterFilters.entity';

interface RenterChatIdDataRaw {
  renterId: string;
  chatId: string;
  botId: string;
}
export interface RenterIdsDataRaw {
  renterId: string;
}

@EntityRepository(RenterEntity)
export class RentersRepository extends Repository<RenterEntity> {
  async createWithRelations(renterData: Partial<RenterEntity>): Promise<RenterEntity> {
    const renter = await this.save(this.create(renterData));

    return renter;
  }

  getFullRenter(renterId: string): Promise<RenterEntity> {
    const renterQb = this.createQueryBuilder('renter').where('renter.id = :renterId', {
      renterId: renterId,
    });
    return this.getWithRelationsQb(renterQb).getOneOrFail();
  }

  getByChatId(chatId: string): Promise<RenterEntity> {
    const renterQb = this.createQueryBuilder('renter').where('telegramUser.chatId = :chatId', {
      chatId: chatId,
    });
    return this.getWithRelationsQb(renterQb).getOneOrFail();
  }

  getWithRelationsQb(renterQb: SelectQueryBuilder<RenterEntity>): SelectQueryBuilder<RenterEntity> {
    return renterQb
      .innerJoinAndSelect('renter.telegramUser', 'telegramUser')
      .innerJoinAndSelect('renter.renterFiltersEntity', 'renterFiltersEntity')
      .innerJoinAndSelect('renter.renterSettingsEntity', 'renterSettingsEntity')
      .leftJoinAndSelect('renter.renterInfoEntity', 'renterInfoEntity');
  }

  getRentersChatId(renterIds: string[]): Promise<RenterChatIdDataRaw[]> {
    const renterIdsString: string = renterIds.join("', '");
    return this.query(`
        SELECT
               t_renters.renter_id as "renterId",
               t_telegramUsers.chat_id AS "chatId",
               t_telegramUsers.bot_id AS "botId"
        FROM renters t_renters
        INNER JOIN telegram_users t_telegramUsers
            ON t_renters.telegram_user_id = t_telegramUsers.telegram_user_id
        WHERE renter_id IN ('${renterIdsString}')
    `);
  }

  findMatchesForObjectToRenters(
    _landlordObject: LandlordObjectEntity,
    matchOptions: {
      gender: GenderEnumType | null;
      location: LocationsEnum;
      objectType: ObjectTypeEnum;
      price: number;
    },
  ): Promise<RenterIdsDataRaw[]> {
    const genderWhere = matchOptions.gender
      ? `
        AND r.gender = '${matchOptions.gender}'
        `
      : '';
    const query: string = `
        SELECT r.renter_id as "renterId" FROM renters r
            INNER JOIN renter_filters rf on r.renter_id = rf.renter_id
        WHERE ((rf.price_range_start IS NULL) OR (rf.price_range_end IS NULL) OR (rf.price_range_start <= ${matchOptions.price} AND rf.price_range_end >= ${matchOptions.price}))
          AND (coalesce(array_length(rf.locations::location_type[], 1), 0) = 0 OR '${matchOptions.location}' = ANY(rf.locations::location_type[]))
          AND (coalesce(array_length(rf.object_type::object_type[], 1), 0) = 0 OR '${matchOptions.objectType}' = ANY(rf.object_type::object_type[]))
        ${genderWhere}
    `;
    return this.query(query);
  }
}
