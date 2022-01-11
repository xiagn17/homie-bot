import { EntityRepository, Repository } from 'typeorm';
import { LocationEntity } from '../entities/Location.entity';
import { LocationEnumType } from '../interfaces/locations.interface';

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
