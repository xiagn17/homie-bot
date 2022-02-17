import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

import { RenterEntity } from './Renter.entity';

export enum ObjectTypeEnum {
  room = 'room',
  apartments = 'apartments',
  bed = 'bed',
}
export enum LocationsEnum {
  center = 'Центр',
  north = 'Север',
  south = 'Юг',
  west = 'Запад',
  east = 'Восток',
}
@Entity({ name: 'renter_filters' })
export class RenterFiltersEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_filter_id' })
  readonly id: string;

  @Column({ type: 'enum', name: 'object_type', enum: ObjectTypeEnum, array: true })
  objectType: ObjectTypeEnum[] | null;

  @Column({ type: 'integer', name: 'price_range_start' })
  priceRangeStart: number | null;

  @Column({ type: 'integer', name: 'price_range_end' })
  priceRangeEnd: number | null;

  @Column({ type: 'enum', name: 'locations', array: true, enum: LocationsEnum })
  locations: LocationsEnum[] | null;

  @Column({ name: 'renter_id', type: 'uuid' })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => RenterEntity)
  renterEntity: RenterEntity;
}
