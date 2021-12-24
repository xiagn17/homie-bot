import { EntityRepository, Repository } from 'typeorm';
import { LocationEntity, LocationEnumType } from '../../entities/directories/Location.entity';

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
