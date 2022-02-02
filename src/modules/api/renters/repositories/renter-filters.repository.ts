import { EntityRepository, Repository } from 'typeorm';
import { RenterFiltersEntity } from '../entities/RenterFilters.entity';

@EntityRepository(RenterFiltersEntity)
export class RenterFiltersRepository extends Repository<RenterFiltersEntity> {
  async createWithRelations(filtersData: Partial<RenterFiltersEntity>): Promise<RenterFiltersEntity> {
    const renterFiltersEntity = await this.save(this.create(filtersData));

    return this.findOneOrFail(renterFiltersEntity.id);
  }
}
