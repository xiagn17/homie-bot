import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { MoneyRange } from '../directories/MoneyRange';
import { SubwayStation } from '../directories/SubwayStation';
import { Interest } from '../directories/Interest';
import { Location } from '../directories/Location';
import { GenderEnumType, WithAnotherGenderEnumType } from '../../modules/api/renters/renters.type';
import { MatchesInfo } from '../matches/MatchesInfo';
import { TelegramUserEntity } from './TelegramUser.entity';

@Entity({ name: 'renters' })
export class RenterEntity {
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

  @ManyToOne(() => MoneyRange)
  @JoinColumn({ name: 'money_range_id' })
  moneyRange: MoneyRange;

  @Column('uuid', { name: 'money_range_id' })
  moneyRangeId: string;

  @Column({ name: 'planned_arrival', type: 'date', nullable: false })
  plannedArrival: string;

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

  @Column({
    type: 'enum',
    name: 'live_with_another_gender',
    nullable: false,
    enum: WithAnotherGenderEnumType,
  })
  liveWithAnotherGender: WithAnotherGenderEnumType;

  @Column({ name: 'telegram_user_id', type: 'uuid', nullable: false, unique: true })
  telegramUserId: string;

  @JoinColumn({ name: 'telegram_user_id' })
  @OneToOne(() => TelegramUserEntity)
  telegramUser: TelegramUserEntity;

  @OneToOne(() => MatchesInfo, info => info.renter)
  matchesInfo: MatchesInfo;
}
