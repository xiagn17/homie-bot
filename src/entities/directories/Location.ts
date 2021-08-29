import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocationEnumType } from '../../modules/tilda-form/tilda-form.types';
import { Renter } from '../users/Renter';

@Entity({ name: 'directory_locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid', { name: 'location_id' })
  readonly id: string;

  @Column({
    name: 'area',
    type: 'varchar',
    nullable: false,
  })
  area: LocationEnumType;

  @OneToMany(() => Renter, renter => renter.location)
  renters: Renter[];
}
