import { EntityRepository, Repository } from 'typeorm';
import { SubwayStation } from '../../entities/directories/SubwayStation';
import { SubwayStationEnumType } from '../../modules/renters/renters.type';

@EntityRepository(SubwayStation)
export class SubwayStationsRepository extends Repository<SubwayStation> {
  async getRenterStationIdsForMatch(renterSubwayStations: SubwayStation[]): Promise<string[]> {
    if (renterSubwayStations.find(station => station.station === SubwayStationEnumType.nevermind)) {
      const nevermindStation = await this.findOneOrFail({ station: SubwayStationEnumType.nevermind });
      return renterSubwayStations.map(station => station.id).concat([nevermindStation.id]);
    }
    return [];
  }
}
