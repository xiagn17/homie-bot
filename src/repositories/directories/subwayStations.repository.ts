import { EntityRepository, Repository } from 'typeorm';
import { SubwayStationEntity, SubwayStationEnumType } from '../../entities/directories/SubwayStation.entity';

@EntityRepository(SubwayStationEntity)
export class SubwayStationsRepository extends Repository<SubwayStationEntity> {
  async getStationIdsForMatch(subwayStations: SubwayStationEntity[]): Promise<string[]> {
    if (subwayStations.find(station => station.station === SubwayStationEnumType.nevermind)) {
      return [];
    }
    const nevermindStation = await this.findOneOrFail({ station: SubwayStationEnumType.nevermind });
    return subwayStations.map(station => station.id).concat([nevermindStation.id]);
  }
}
