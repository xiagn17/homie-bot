import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { RenterEntity } from '../entities/Renter.entity';
import { GenderEnumType } from '../interfaces/renters.type';
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

  findMatchesForObjectToRenters(matchOptions: {
    gender: GenderEnumType | null;
    location: LocationsEnum;
    objectType: ObjectTypeEnum;
    price: number;
    excludedRenterIds: string[];
  }): Promise<RenterIdsDataRaw[]> {
    let query: string = `
        SELECT r.renter_id as "renterId" FROM renters r
            INNER JOIN renter_filters rf on r.renter_id = rf.renter_id
            INNER JOIN renter_settings rs on r.renter_id = rs.renter_id
        WHERE rs.in_search = true
          AND ((rf.price_range_start IS NULL) OR (rf.price_range_end IS NULL) OR (rf.price_range_start <= ${matchOptions.price} AND rf.price_range_end >= ${matchOptions.price}))
          AND (coalesce(array_length(rf.locations::location_type[], 1), 0) = 0 OR '${matchOptions.location}' = ANY(rf.locations::location_type[]))
          AND (coalesce(array_length(rf.object_type::object_type[], 1), 0) = 0 OR '${matchOptions.objectType}' = ANY(rf.object_type::object_type[]))
    `;
    if (matchOptions.gender) {
      const text = `
          AND r.gender = '${matchOptions.gender}'
      `;
      query += text;
    }
    if (matchOptions.excludedRenterIds.length) {
      const excludedObjectIdsString = matchOptions.excludedRenterIds.join(`', '`);
      const text = `
          AND r.renter_id NOT IN ('${excludedObjectIdsString}')
      `;
      query += text;
    }
    return this.query(query);
  }
}
