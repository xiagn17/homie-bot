import { EntityRepository, Repository } from 'typeorm';
import { SubwayStationEntity } from '../entities/SubwayStation.entity';
import { SubwayStationEnumType } from '../interfaces/subway-stations.interface';

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
