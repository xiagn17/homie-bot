import { EntityRepository, Repository } from 'typeorm';
import { LocationEntity } from '../../entities/directories/Location.entity';
import { LocationEnumType } from '../../modules/api/renters/renters.type';

@EntityRepository(LocationEntity)
export class LocationsRepository extends Repository<LocationEntity> {
  async getRenterLocationIdsForMatch(renterLocation: LocationEntity): Promise<string[]> {
    if (renterLocation.area !== LocationEnumType.nevermind) {
      const nevermindLocation = await this.findOneOrFail({ area: LocationEnumType.nevermind });
      return [renterLocation.id, nevermindLocation.id];
    }
    return [];
  }
}
