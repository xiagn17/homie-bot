import { EntityRepository, Repository } from 'typeorm';
import { RenterMatchEntity } from '../../entities/matches/RenterMatch.entity';
import { RenterEntity } from '../../entities/renters/Renter.entity';
import { MatchStatusEnumType } from '../../modules/api/renter-matches/renter-matches.type';

@EntityRepository(RenterMatchEntity)
export class RenterMatchesRepository extends Repository<RenterMatchEntity> {
  createMatch(
    renter: RenterEntity,
    matchedRenter: RenterEntity,
    status: MatchStatusEnumType,
  ): Promise<RenterMatchEntity> {
    return this.save(
      this.create({
        firstId: renter.id,
        secondId: matchedRenter.id,
        status: status,
      }),
    );
  }

  findResolvedRejectedMatches(renterId: string): Promise<RenterMatchEntity[]> {
    return this.createQueryBuilder('match')
      .where('(match.firstId = :renterId OR match.secondId = :renterId)', { renterId })
      .andWhere('(match.status = :rejected OR match.status = :resolved)', {
        rejected: MatchStatusEnumType.rejected,
        resolved: MatchStatusEnumType.resolved,
      })
      .getMany();
  }

  async changeMatchStatus(matchId: string, status: MatchStatusEnumType): Promise<RenterMatchEntity> {
    await this.save({
      id: matchId,
      status: status,
    });
    return this.findOneOrFail(matchId);
  }

  getProcessingMatch(renterId: string): Promise<RenterMatchEntity | undefined> {
    return this.createQueryBuilder('match')
      .where('(match.firstId = :renterId OR match.secondId = :renterId)', { renterId })
      .andWhere('match.status = :processingStatus', { processingStatus: MatchStatusEnumType.processing })
      .getOne();
  }
}
