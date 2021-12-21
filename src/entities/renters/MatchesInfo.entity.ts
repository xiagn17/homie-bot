import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from './Renter.entity';

@Entity({ name: 'matches_info' })
export class MatchesInfoEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'matches_info_id' })
  readonly id: string;

  @Column({ name: 'renter_id', type: 'uuid', nullable: false, unique: true })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => RenterEntity)
  renter: RenterEntity;

  @Column({ type: 'smallint', name: 'able_matches', nullable: false, default: 0 })
  ableMatches: number;

  @Column({ type: 'boolean', name: 'in_search_mate', nullable: false, default: false })
  inSearchMate: boolean;

  @Column({ type: 'boolean', name: 'in_search_room', nullable: false, default: false })
  inSearchRoom: boolean;
}
