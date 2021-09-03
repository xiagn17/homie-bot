import { EntityRepository, Repository } from 'typeorm';
import { Renter } from '../../entities/users/Renter';
import { MoneyRange } from '../../entities/directories/MoneyRange';
import { SubwayStation } from '../../entities/directories/SubwayStation';
import { Interest } from '../../entities/directories/Interest';

@EntityRepository(Renter)
export class RentersRepository extends Repository<Renter> {
  async createWithRelations(
    renterData: Partial<Renter>,
    moneyRanges: MoneyRange[],
    subwayStations: SubwayStation[],
    interests: Interest[],
  ): Promise<Renter> {
    const renter = await this.save(this.create(renterData));

    await this.createQueryBuilder('renter').relation('moneyRanges').of(renter.id).add(moneyRanges);
    await this.createQueryBuilder('renter').relation('subwayStations').of(renter.id).add(subwayStations);
    await this.createQueryBuilder('renter').relation('interests').of(renter.id).add(interests);

    return this.findOneOrFail(renter.id);
  }

  async archiveById(renterId: string): Promise<Renter> {
    const renter = await this.findOneOrFail(renterId);
    return this.save(
      this.merge(renter, {
        archivedAt: new Date(),
      }),
    );
  }
}
