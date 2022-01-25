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

import { MoneyRangeEntity } from '../../directories/entities/MoneyRange.entity';
import { SubwayStationEntity } from '../../directories/entities/SubwayStation.entity';
import { InterestEntity } from '../../directories/entities/Interest.entity';
import { LocationEntity } from '../../directories/entities/Location.entity';
import { GenderEnumType, WithAnotherGenderEnumType } from '../interfaces/renters.type';
import { TelegramUserEntity } from '../../telegram-bot/entities/TelegramUser.entity';
import { MatchesInfoEntity } from './MatchesInfo.entity';

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

  @ManyToOne(() => MoneyRangeEntity)
  @JoinColumn({ name: 'money_range_id' })
  moneyRange: MoneyRangeEntity;

  @Column('uuid', { name: 'money_range_id' })
  moneyRangeId: string;

  @Column({ name: 'planned_arrival', type: 'date', nullable: false })
  plannedArrival: string;

  @ManyToOne(() => LocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @Column('uuid', { name: 'location_id' })
  locationId: string;

  @ManyToMany(() => SubwayStationEntity)
  @JoinTable({
    name: 'renters_j_directory_subway_stations',
    joinColumn: { name: 'renter_id' },
    inverseJoinColumn: { name: 'subway_station_id' },
  })
  subwayStations: SubwayStationEntity[];

  @Column({ type: 'varchar', name: 'university', nullable: true })
  university: string | null;

  @ManyToMany(() => InterestEntity)
  @JoinTable({
    name: 'renters_j_directory_interests',
    joinColumn: { name: 'renter_id' },
    inverseJoinColumn: { name: 'interest_id' },
  })
  interests: InterestEntity[];

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

  @Column({
    type: 'boolean',
    name: 'with_animals',
    nullable: false,
    default: false,
  })
  withAnimals: boolean;

  @Column({ name: 'telegram_user_id', type: 'uuid', nullable: false, unique: true })
  telegramUserId: string;

  @JoinColumn({ name: 'telegram_user_id' })
  @OneToOne(() => TelegramUserEntity)
  telegramUser: TelegramUserEntity;

  @OneToOne(() => MatchesInfoEntity, info => info.renter)
  matchesInfo: MatchesInfoEntity;

  @Column({
    type: 'smallint',
    name: 'able_contacts',
    default: 0,
    nullable: false,
  })
  ableContacts: number;
}
