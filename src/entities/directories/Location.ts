import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToMany(() => Renter)
  @JoinTable({
    name: 'renters_j_directory_locations',
    joinColumn: { name: 'location_id' },
    inverseJoinColumn: { name: 'renter_id' },
  })
  renters: Renter[];
}
