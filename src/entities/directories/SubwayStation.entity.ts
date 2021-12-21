import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../renters/Renter.entity';
import { SubwayStationEnumType } from '../../modules/api/renters/renters.type';

@Entity({ name: 'directory_subway_stations' })
export class SubwayStationEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'subway_station_id' })
  readonly id: string;

  @Column({
    name: 'station',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  station: SubwayStationEnumType;

  @ManyToMany(() => RenterEntity)
  @JoinTable({
    name: 'renters_j_directory_subway_stations',
    joinColumn: { name: 'subway_station_id' },
    inverseJoinColumn: { name: 'renter_id' },
  })
  renters: RenterEntity[];
}
