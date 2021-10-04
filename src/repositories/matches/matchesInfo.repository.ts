import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { MatchesInfo } from '../../entities/matches/MatchesInfo';

@EntityRepository(MatchesInfo)
export class MatchesInfoRepository extends Repository<MatchesInfo> {
  stopSearching(renterId: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(MatchesInfo)
      .set({
        inSearch: false,
      })
      .where('renterId = :renterId', { renterId: renterId })
      .execute();
  }

  startSearching(renterId: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(MatchesInfo)
      .set({
        inSearch: true,
      })
      .where('renterId = :renterId', { renterId: renterId })
      .execute();
  }

  getMatchesInfoByRenterId(renterId: string): Promise<MatchesInfo | undefined> {
    return this.createQueryBuilder('matchesInfo')
      .where('matchesInfo.renterId = :renterId', { renterId: renterId })
      .getOne();
  }

  async decreaseAbleMatches(matchesInfo: MatchesInfo): Promise<MatchesInfo> {
    await this.save({
      id: matchesInfo.id,
      ableMatches: matchesInfo.ableMatches - 1,
    });
    return this.findOneOrFail(matchesInfo.id);
  }

  async addAbleMatches(matchesInfo: MatchesInfo, matchesCount: number): Promise<MatchesInfo> {
    await this.save({
      id: matchesInfo.id,
      ableMatches: matchesInfo.ableMatches + matchesCount,
    });
    return this.findOneOrFail(matchesInfo.id);
  }

  createInfo(renterId: string, defaultAbleMatches: number): Promise<MatchesInfo> {
    return this.save(
      this.create({
        renterId: renterId,
        ableMatches: defaultAbleMatches,
        inSearch: false,
      }),
    );
  }
}
