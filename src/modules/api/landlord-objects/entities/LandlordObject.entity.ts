import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TelegramUserEntity } from '../../telegram-bot/entities/TelegramUser.entity';
import { LocationsEnum, ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';
import { LandlordObjectDetailsInterface } from '../interfaces/landlord-object-details.interface';
import { LandlordObjectRoomBedInfoInterface } from '../interfaces/landlord-object-room-bed-info.interface';
import { LandlordObjectApartmentsInfoInterface } from '../interfaces/landlord-object-apartments-info.interface';
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

  @Column({ name: 'number', unique: true })
  number: number;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    nullable: false,
  })
  phoneNumber: string;

  @Column({ type: 'enum', name: 'location', enum: LocationsEnum })
  location: LocationsEnum;

  @Column({ type: 'varchar', name: 'address' })
  address: string;

  @Column({ type: 'enum', name: 'preferred_gender', nullable: false, enum: PreferredGenderEnumType })
  preferredGender: PreferredGenderEnumType;

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

  @OneToMany(() => LandlordObjectPhotoEntity, photo => photo.landlordObject)
  photos: LandlordObjectPhotoEntity[];

  @Column({ name: 'created_at', type: 'timestamptz', default: 'now()' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  readonly updatedAt: Date | null;

  @Column({ name: 'archived_at', type: 'timestamptz' })
  readonly archivedAt: Date | null;

  @Column({ name: 'object_type', type: 'enum', enum: ObjectTypeEnum })
  objectType: ObjectTypeEnum;

  @Column({ name: 'rooms_number', type: 'varchar' })
  roomsNumber: string;

  @Column({ name: 'details', type: 'jsonb' })
  details: LandlordObjectDetailsInterface;

  @Column({ name: 'apartments_info', type: 'jsonb' })
  apartmentsInfo: LandlordObjectApartmentsInfoInterface | null;

  @Column({ name: 'room_bed_info', type: 'jsonb' })
  roomBedInfo: LandlordObjectRoomBedInfoInterface | null;

  @Column({ name: 'is_admin', type: 'boolean' })
  isAdmin: boolean;
}
