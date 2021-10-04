import { EntityRepository, Repository } from 'typeorm';
import { RenterMatch } from '../../entities/matches/RenterMatch';
import { Renter } from '../../entities/users/Renter';
import { MatchStatusEnumType } from '../../modules/renter-matches/renter-matches.type';

@EntityRepository(RenterMatch)
export class RenterMatchesRepository extends Repository<RenterMatch> {
  createMatch(renter: Renter, matchedRenter: Renter, status: MatchStatusEnumType): Promise<RenterMatch> {
    return this.save(
      this.create({
        firstId: renter.id,
        secondId: matchedRenter.id,
        status: status,
      }),
    );
  }

  findResolvedRejectedMatches(renterId: string): Promise<RenterMatch[]> {
    return this.createQueryBuilder('match')
      .where('(match.firstId = :renterId OR match.secondId = :renterId)', { renterId })
      .andWhere('(match.status = :rejected OR match.status = :resolved)', {
        rejected: MatchStatusEnumType.rejected,
        resolved: MatchStatusEnumType.resolved,
      })
      .getMany();
  }

  async changeMatchStatus(matchId: string, status: MatchStatusEnumType): Promise<RenterMatch> {
    await this.save({
      id: matchId,
      status: status,
    });
    return this.findOneOrFail(matchId);
  }

  getProcessingMatch(renterId: string): Promise<RenterMatch | undefined> {
    return this.createQueryBuilder('match')
      .where('(match.firstId = :renterId OR match.secondId = :renterId)', { renterId })
      .andWhere('match.status = :processingStatus', { processingStatus: MatchStatusEnumType.processing })
      .getOne();
  }
}
