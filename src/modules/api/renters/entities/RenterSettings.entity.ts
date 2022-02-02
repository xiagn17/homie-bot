import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

import { RenterEntity } from './Renter.entity';

@Entity({ name: 'renter_settings' })
export class RenterSettingsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_settings_id' })
  readonly id: string;

  @Column({ name: 'in_search', type: 'boolean', default: true })
  inSearch: boolean;

  @Column({ name: 'able_contacts', type: 'smallint', default: 0 })
  ableContacts: number;

  @Column({ name: 'renter_id', type: 'uuid' })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => RenterEntity)
  renterEntity: RenterEntity;
}
