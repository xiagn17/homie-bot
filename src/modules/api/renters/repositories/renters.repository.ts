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

@EntityRepository(RenterEntity)
export class RentersRepository extends Repository<RenterEntity> {
  async createWithRelations(renterData: Partial<RenterEntity>): Promise<RenterEntity> {
    const renter = await this.save(this.create(renterData));

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
      price: string;
    },
  ): Promise<RenterEntity[]> {
    const rentersQuery = this.createQueryBuilder('renter');

    rentersQuery.innerJoin(
      'renter.renterFiltersEntity',
      'filters',
      `((filters.priceRangeStart = NULL) OR (filters.priceRangeStart <= :price AND filters.priceRangeEnd >= :price))
       AND (:location = ANY(filters.locations::location_type[]) OR coalesce(array_length(filters.locations, 1), 0) = 0)
       AND (:objectType = ANY(filters.object_type::object_type[]) OR coalesce(array_length(filters.object_type, 1), 0) = 0)`,
      {
        price: Number(matchOptions.price),
        location: matchOptions.location,
        objectType: matchOptions.objectType,
      },
    );
    if (matchOptions.gender) {
      rentersQuery.where('renter.gender = :gender', {
        gender: matchOptions.gender,
      });
    }

    return rentersQuery.getMany();
  }
}
