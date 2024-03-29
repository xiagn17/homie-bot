import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

import { RenterEntity } from './Renter.entity';

@Entity({ name: 'renter_settings' })
export class RenterSettingsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_settings_id' })
  readonly id: string;

  @Column({ name: 'in_search', type: 'boolean', default: true })
  inSearch: boolean;

  @Column({ name: 'subscription_trial_started', type: 'timestamptz' })
  subscriptionTrialStarted: Date | null;

  @Column({ name: 'subscription_trial_ends', type: 'timestamptz' })
  subscriptionTrialEnds: Date | null;

  @Column({ name: 'subscription_started', type: 'timestamptz' })
  subscriptionStarted: Date | null;

  @Column({ name: 'subscription_ends', type: 'timestamptz' })
  subscriptionEnds: Date | null;

  @Column({ name: 'renter_id', type: 'uuid' })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => RenterEntity)
  renterEntity: RenterEntity;
}
