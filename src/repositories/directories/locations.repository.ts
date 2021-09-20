import { EntityRepository, Repository } from 'typeorm';
import { Location } from '../../entities/directories/Location';
import { LocationEnumType } from '../../modules/renters/renters.type';

@EntityRepository(Location)
export class LocationsRepository extends Repository<Location> {
  async getRenterLocationIdsForMatch(renterLocation: Location): Promise<string[]> {
    if (renterLocation.area !== LocationEnumType.nevermind) {
      const nevermindLocation = await this.findOneOrFail({ area: LocationEnumType.nevermind });
      return [renterLocation.id, nevermindLocation.id];
    }
    return [];
  }
}
