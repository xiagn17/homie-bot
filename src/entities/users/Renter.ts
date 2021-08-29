import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { MoneyRange } from '../directories/MoneyRange';
import { GenderEnumType } from '../../modules/tilda-form/tilda-form.types';
import { SubwayStation } from '../directories/SubwayStation';
import { Interest } from '../directories/Interest';
import { Location } from '../directories/Location';

@Entity({ name: 'renters' })
export class Renter {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_id' })
  readonly id: string;

  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({
    type: 'enum',
    name: 'gender',
    nullable: false,
    enum: GenderEnumType,
  })
  gender: GenderEnumType;

  @Column({
    type: 'smallint',
    name: 'birthday_year',
    nullable: false,
  })
  birthdayYear: number;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    nullable: false,
  })
  phoneNumber: string;

  @ManyToMany(() => MoneyRange)
  @JoinTable({
    name: 'renters_j_directory_money_ranges',
    joinColumn: { name: 'renter_id' },
    inverseJoinColumn: { name: 'money_range_id' },
  })
  moneyRanges: MoneyRange[];

  @Column({ name: 'planned_arrival', type: 'date', nullable: false })
  plannedArrival: Date;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column('uuid', { name: 'location_id' })
  locationId: string;

  @ManyToMany(() => SubwayStation)
  @JoinTable({
    name: 'renters_j_directory_subway_stations',
    joinColumn: { name: 'renter_id' },
    inverseJoinColumn: { name: 'subway_station_id' },
  })
  subwayStations: SubwayStation[];

  @Column({ type: 'varchar', name: 'university', nullable: true })
  university: string | null;

  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'renters_j_directory_interests',
    joinColumn: { name: 'renter_id' },
    inverseJoinColumn: { name: 'interest_id' },
  })
  interests: Interest[];

  @Column({ type: 'text', name: 'preferences', nullable: true })
  preferences: string | null;

  @Column({ type: 'varchar', name: 'zodiac_sign', nullable: true })
  zodiacSign: string | null;

  @Column({ type: 'varchar', name: 'socials', nullable: false })
  socials: string;

  @Column({ type: 'varchar', name: 'telegram', nullable: false })
  telegram: string;

  // form's request id
  @Column({ type: 'varchar', name: 'request_id', nullable: true })
  requestId: string | null;

  @Column({ type: 'varchar', name: 'utm_source', nullable: true })
  utmSource: string | null;

  // form' request sent time
  @Column({ name: 'created_at', type: 'timestamptz', default: 'now()' })
  createdAt: Date;
}
