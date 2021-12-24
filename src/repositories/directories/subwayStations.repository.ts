import { EntityRepository, Repository } from 'typeorm';
import { SubwayStationEntity, SubwayStationEnumType } from '../../entities/directories/SubwayStation.entity';

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
