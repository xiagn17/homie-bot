import { EntityRepository, Repository } from 'typeorm';
import { LocationEntity, LocationEnumType } from '../../entities/directories/Location.entity';

@EntityRepository(LocationEntity)
export class LocationsRepository extends Repository<LocationEntity> {
  async getLocationIdsForMatch(location: LocationEntity): Promise<string[]> {
    if (location.area === LocationEnumType.nevermind) {
      return [];
    }
    const nevermindLocation = await this.findOneOrFail({ area: LocationEnumType.nevermind });
    return [location.id, nevermindLocation.id];
  }
}
