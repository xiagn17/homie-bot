import { EntityRepository, Repository } from 'typeorm';
import { RenterInfoEntity } from '../entities/RenterInfo.entity';

@EntityRepository(RenterInfoEntity)
export class RenterInfosRepository extends Repository<RenterInfoEntity> {
  async createWithRelations(infoData: Partial<RenterInfoEntity>): Promise<RenterInfoEntity> {
    const renterInfoEntity = await this.save(this.create(infoData));

    return this.findOneOrFail(renterInfoEntity.id);
  }
}
