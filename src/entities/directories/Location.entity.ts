import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../renters/Renter.entity';
import { LocationEnumType } from '../../modules/api/renters/renters.type';

@Entity({ name: 'directory_locations' })
export class LocationEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'location_id' })
  readonly id: string;

  @Column({
    name: 'area',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  area: LocationEnumType;

  @OneToMany(() => RenterEntity, renter => renter.location)
  renters: RenterEntity[];
}
