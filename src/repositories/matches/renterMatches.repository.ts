import { DeleteResult, EntityRepository, InsertResult, Repository } from 'typeorm';
import { RenterMatch } from '../../entities/matches/RenterMatch';
import { Renter } from '../../entities/users/Renter';
import { MatchStatusEnumType } from '../../modules/renter-matches/renter-matches.type';

@EntityRepository(RenterMatch)
export class RenterMatchesRepository extends Repository<RenterMatch> {
  insertMatches(renter: Renter, matchedRenters: Renter[]): Promise<InsertResult> {
    const result: Partial<RenterMatch>[] = matchedRenters.map(matchedRenter => ({
      firstId: renter.id,
      secondId: matchedRenter.id,
    }));
    return this.insert(result);
  }

  getAbleMatch(renterId: string): Promise<RenterMatch | undefined> {
    return this.createQueryBuilder('match')
      .where('(match.firstId = :renterId OR match.secondId = :renterId)', { renterId })
      .andWhere('match.status = :ableStatus', { ableStatus: MatchStatusEnumType.able })
      .getOne();
  }

  startProcessingMatch(renterMatch: RenterMatch): Promise<RenterMatch> {
    return this.save({
      id: renterMatch.id,
      status: MatchStatusEnumType.processing,
    });
  }

  deleteAbleMatches(renterId: string): Promise<DeleteResult> {
    return this.createQueryBuilder('renterMatches')
      .delete()
      .where('(firstId = :id OR secondId = :id) AND status = :ableStatus', {
        id: renterId,
        ableStatus: MatchStatusEnumType.able,
      })
      .execute();
  }
}
