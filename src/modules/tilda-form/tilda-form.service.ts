import { Injectable } from '@nestjs/common';
import { Any, Connection } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { MoneyRange } from '../../entities/directories/MoneyRange';
import { Location } from '../../entities/directories/Location';
import { SubwayStation } from '../../entities/directories/SubwayStation';
import { Interest } from '../../entities/directories/Interest';
import { RentersRepository } from '../../repositories/users/renters.repository';
import { MatchRentersService } from '../match-renter/match-renters.service';
import { Renter } from '../../entities/users/Renter';
import { RenterRequestDTO } from './tilda-form.dto';
import { TildaFormSerializer } from './tilda-form.serializer';

@Injectable()
export class TildaFormService {
  constructor(
    private logger: Logger,

    private tildaFormSerializer: TildaFormSerializer,

    private matchRentersService: MatchRentersService,

    private connection: Connection,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async processRenter(data: RenterRequestDTO): Promise<void> {
    const renter = await this.connection.transaction<Renter>(async manager => {
      const location = await manager.getRepository(Location).findOneOrFail({ area: data.location });
      const moneyRanges = await manager.getRepository(MoneyRange).find({ range: Any(data.moneyRange) });
      const interests = await manager.getRepository(Interest).find({ interest: Any(data.interests ?? []) });
      const subwayStations = await manager
        .getRepository(SubwayStation)
        .find({ station: Any(data.subwayStations) });

      const renterData = this.tildaFormSerializer.deserialize(data, location);

      const renter = await manager
        .getCustomRepository(RentersRepository)
        .createWithRelations(renterData, moneyRanges, subwayStations, interests);

      return renter;
    });
    await this.matchRentersService.createMatchesForRenter(renter);
  }

  async archiveRenter(renterId: string): Promise<void> {
    await this.connection.getCustomRepository(RentersRepository).archiveById(renterId);
    await this.matchRentersService.deleteAllMatchesByRenterId(renterId);
  }
}
