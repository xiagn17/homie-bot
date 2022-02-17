import { EntityRepository, Repository } from 'typeorm';
import { RenterSettingsEntity } from '../entities/RenterSettings.entity';

@EntityRepository(RenterSettingsEntity)
export class RenterSettingsRepository extends Repository<RenterSettingsEntity> {
  async createWithRelations(settingsData: Partial<RenterSettingsEntity>): Promise<RenterSettingsEntity> {
    const renterSettingsEntity = await this.save(this.create(settingsData));

    return this.findOneOrFail(renterSettingsEntity.id);
  }

  async addContacts(telegramUserId: string, count: number): Promise<number> {
    const renterSettings = await this.findOneOrFail(
      { renterEntity: { telegramUserId: telegramUserId } },
      { relations: ['renterEntity'] },
    );
    renterSettings.ableContacts += count;
    await this.save(renterSettings);
    return renterSettings.ableContacts;
  }

  async addPrivateHelper(telegramUserId: string): Promise<void> {
    const renterSettings = await this.findOneOrFail(
      { renterEntity: { telegramUserId: telegramUserId } },
      { relations: ['renterEntity'] },
    );
    renterSettings.privateHelper = true;
    await this.save(renterSettings);
  }

  async removeContact(renterId: string): Promise<number> {
    const renter = await this.findOneOrFail({ renterId: renterId });
    renter.ableContacts -= 1;
    await this.save(renter);
    return renter.ableContacts;
  }
}
