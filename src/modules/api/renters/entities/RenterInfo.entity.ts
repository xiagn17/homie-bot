import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

import { RentersInfoLifestyleInterface } from '../interfaces/renters-info-lifestyle.interface';
import { RenterEntity } from './Renter.entity';

@Entity({ name: 'renter_infos' })
export class RenterInfoEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_info_id' })
  readonly id: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({
    type: 'smallint',
    name: 'birthday_year',
  })
  birthdayYear: number;

  @Column({
    type: 'varchar',
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'zodiac_sign' })
  zodiacSign: string | null;

  @Column({ type: 'varchar', name: 'socials' })
  socials: string;

  @Column({ type: 'jsonb', name: 'lifestyle' })
  lifestyle: RentersInfoLifestyleInterface;

  @Column({ type: 'varchar', name: 'profession' })
  profession: string;

  @Column({ type: 'text', name: 'about' })
  about: string;

  @Column({ type: 'varchar', name: 'photo', array: true })
  photo: string;

  @Column({ name: 'renter_id', type: 'uuid' })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => RenterEntity)
  renterEntity: RenterEntity;
}
