import { EntityRepository, Repository } from 'typeorm';
import { SubwayStationEntity } from '../../entities/directories/SubwayStation.entity';
import { SubwayStationEnumType } from '../../modules/api/renters/renters.type';

@EntityRepository(SubwayStationEntity)
export class SubwayStationsRepository extends Repository<SubwayStationEntity> {
  async getRenterStationIdsForMatch(renterSubwayStations: SubwayStationEntity[]): Promise<string[]> {
    if (renterSubwayStations.find(station => station.station === SubwayStationEnumType.nevermind)) {
      const nevermindStation = await this.findOneOrFail({ station: SubwayStationEnumType.nevermind });
      return renterSubwayStations.map(station => station.id).concat([nevermindStation.id]);
    }
    return [];
  }
}
