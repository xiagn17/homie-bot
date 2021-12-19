import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../users/Renter.entity';

@Entity({ name: 'matches_info' })
export class MatchesInfo {
  @PrimaryGeneratedColumn('uuid', { name: 'matches_info_id' })
  readonly id: string;

  @Column({ name: 'renter_id', type: 'uuid', nullable: false, unique: true })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => RenterEntity)
  renter: RenterEntity;

  @Column({ type: 'smallint', name: 'able_matches', nullable: false, default: 0 })
  ableMatches: number;

  @Column({ type: 'boolean', name: 'in_search', nullable: false, default: false })
  inSearch: boolean;
}
