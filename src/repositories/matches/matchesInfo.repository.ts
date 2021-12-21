import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { MatchesInfoEntity } from '../../entities/renters/MatchesInfo.entity';

@EntityRepository(MatchesInfoEntity)
export class MatchesInfoRepository extends Repository<MatchesInfoEntity> {
  stopSearching(renterId: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(MatchesInfoEntity)
      .set({
        inSearchMate: false,
      })
      .where('renterId = :renterId', { renterId: renterId })
      .execute();
  }

  startSearching(renterId: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(MatchesInfoEntity)
      .set({
        inSearchMate: true,
      })
      .where('renterId = :renterId', { renterId: renterId })
      .execute();
  }

  getMatchesInfoByRenterId(renterId: string): Promise<MatchesInfoEntity> {
    return this.createQueryBuilder('matchesInfo')
      .where('matchesInfo.renterId = :renterId', { renterId: renterId })
      .getOneOrFail();
  }

  async decreaseAbleMatches(matchesInfo: MatchesInfoEntity): Promise<MatchesInfoEntity> {
    await this.save({
      id: matchesInfo.id,
      ableMatches: matchesInfo.ableMatches - 1,
    });
    return this.findOneOrFail(matchesInfo.id);
  }

  async addAbleMatches(matchesInfo: MatchesInfoEntity, matchesCount: number): Promise<MatchesInfoEntity> {
    await this.save({
      id: matchesInfo.id,
      ableMatches: matchesInfo.ableMatches + matchesCount,
    });
    return this.findOneOrFail(matchesInfo.id);
  }

  createInfo(renterId: string, defaultAbleMatches: number): Promise<MatchesInfoEntity> {
    return this.save(
      this.create({
        renterId: renterId,
        ableMatches: defaultAbleMatches,
        inSearchMate: false,
      }),
    );
  }
}
