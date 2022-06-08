import { EntityRepository, Repository } from 'typeorm';
import { RenterSettingsEntity } from '../entities/RenterSettings.entity';

@EntityRepository(RenterSettingsEntity)
export class RenterSettingsRepository extends Repository<RenterSettingsEntity> {
  async createWithRelations(settingsData: Partial<RenterSettingsEntity>): Promise<RenterSettingsEntity> {
    const renterSettingsEntity = await this.save(this.create(settingsData));

    return this.findOneOrFail(renterSettingsEntity.id);
  }

  findByTelegramUserId(telegramUserId: string): Promise<RenterSettingsEntity> {
    return this.findOneOrFail(
      { renterEntity: { telegramUserId: telegramUserId } },
      { relations: ['renterEntity'] },
    );
  }

  async startSubscription(telegramUserId: string, startedAt: Date, endsAt: Date): Promise<void> {
    const renterSettings = await this.findOneOrFail(
      { renterEntity: { telegramUserId: telegramUserId } },
      { relations: ['renterEntity'] },
    );
    renterSettings.subscriptionStarted = startedAt;
    renterSettings.subscriptionEnds = endsAt;
    await this.save(renterSettings);
  }

  async startTrialSubscription(renterId: string, startedAt: Date, endsAt: Date): Promise<void> {
    const renterSettings = await this.findOneOrFail(
      { renterEntity: { id: renterId } },
      { relations: ['renterEntity'] },
    );
    renterSettings.subscriptionTrialStarted = startedAt;
    renterSettings.subscriptionTrialEnds = endsAt;
    await this.save(renterSettings);
  }

  async stopSearch(renterId: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        inSearch: false,
      })
      .where('renterId = :renterId', { renterId: renterId })
      .execute();
  }

  async resumeSearch(renterId: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        inSearch: true,
      })
      .where('renterId = :renterId', { renterId: renterId })
      .execute();
  }
}
