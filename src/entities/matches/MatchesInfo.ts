import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Renter } from '../users/Renter';

// Создаётся 1 раз - когда "найти соседа" в первый раз клацает
@Entity({ name: 'matches_info' })
export class MatchesInfo {
  @PrimaryGeneratedColumn('uuid', { name: 'matches_info_id' })
  readonly id: string;

  @Column({ name: 'renter_id', type: 'uuid', nullable: false, unique: true })
  renterId: string;

  @JoinColumn({ name: 'renter_id' })
  @OneToOne(() => Renter)
  renter: Renter;

  @Column({ type: 'smallint', name: 'able_matches', nullable: false, default: 0 })
  ableMatches: number;

  @Column({ type: 'boolean', name: 'in_search', nullable: false, default: false })
  inSearch: boolean;
}
