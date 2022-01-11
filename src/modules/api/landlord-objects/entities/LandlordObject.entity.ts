import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SubwayStationEntity } from '../../directories/entities/SubwayStation.entity';
import { LocationEntity } from '../../directories/entities/Location.entity';
import { TelegramUserEntity } from '../../telegram-bot/entities/TelegramUser.entity';
import { LandlordObjectPhotoEntity } from './LandlordObjectPhoto.entity';

export enum PreferredGenderEnumType {
  MALE = 'male',
  FEMALE = 'female',
  NO_DIFFERENCE = 'no_difference',
}

@Entity({ name: 'landlord_objects' })
export class LandlordObjectEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'landlord_object_id' })
  readonly id: string;

  @Column({ name: 'number', unique: true, nullable: false })
  number: number;

  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    nullable: false,
  })
  phoneNumber: string;

  @ManyToOne(() => LocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @Column('uuid', { name: 'location_id' })
  locationId: string;

  @Column({ type: 'varchar', name: 'address', nullable: false })
  address: string;

  @Column({
    type: 'smallint',
    name: 'average_age',
    nullable: false,
  })
  averageAge: number;

  @Column({ type: 'enum', name: 'preferred_gender', nullable: false, enum: PreferredGenderEnumType })
  preferredGender: PreferredGenderEnumType;

  @Column({ name: 'show_couples', type: 'boolean', nullable: false })
  showCouples: boolean;

  @Column({ name: 'show_with_animals', type: 'boolean', nullable: false })
  showWithAnimals: boolean;

  @Column({ name: 'start_arrival_date', type: 'date', nullable: false })
  startArrivalDate: string;

  @Column({ type: 'varchar', name: 'price', nullable: false })
  price: string;

  @Column({ type: 'text', name: 'comment', nullable: false })
  comment: string;

  @Column({ name: 'telegram_user_id', type: 'uuid', nullable: false, unique: true })
  telegramUserId: string;

  @JoinColumn({ name: 'telegram_user_id' })
  @OneToOne(() => TelegramUserEntity)
  telegramUser: TelegramUserEntity;

  @Column({ name: 'is_approved', type: 'boolean', nullable: false, default: false })
  isApproved: boolean;

  @ManyToMany(() => SubwayStationEntity)
  @JoinTable({
    name: 'landlord_objects_j_directory_subway_stations',
    joinColumn: { name: 'landlord_object_id' },
    inverseJoinColumn: { name: 'subway_station_id' },
  })
  subwayStations: SubwayStationEntity[];

  @OneToMany(() => LandlordObjectPhotoEntity, photo => photo.landlordObject)
  photos: LandlordObjectPhotoEntity[];

  @Column({ name: 'created_at', type: 'timestamptz', default: 'now()' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  readonly updatedAt: Date | null;

  @Column({ name: 'archived_at', type: 'timestamptz' })
  readonly archivedAt: Date | null;
}
