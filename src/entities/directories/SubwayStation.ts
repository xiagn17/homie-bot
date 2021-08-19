import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubwayStationEnumType } from '../../modules/tilda-form/tilda-form.types';
import { Renter } from '../users/Renter';

@Entity({ name: 'directory_subway_stations' })
export class SubwayStation {
  @PrimaryGeneratedColumn('uuid', { name: 'subway_station_id' })
  readonly id: string;

  @Column({
    name: 'station',
    type: 'varchar',
    nullable: false,
  })
  station: SubwayStationEnumType;

  @ManyToMany(() => Renter)
  @JoinTable({
    name: 'renters_j_directory_subway_stations',
    joinColumn: { name: 'subway_station_id' },
    inverseJoinColumn: { name: 'renter_id' },
  })
  renters: Renter[];
}
