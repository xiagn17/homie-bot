import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Renter } from '../users/Renter';

@Entity({ name: 'matched_renters' })
@Unique(['firstId', 'secondId'])
export class MatchedRenters {
  @PrimaryGeneratedColumn('uuid', { name: 'matched_renters_id' })
  readonly id: string;

  @ManyToOne(() => Renter)
  @JoinColumn({ name: 'first_id' })
  first: Renter;

  @Column('uuid', { name: 'first_id', nullable: false })
  firstId: string;

  @ManyToOne(() => Renter)
  @JoinColumn({ name: 'second_id' })
  second: Renter;

  @Column('uuid', { name: 'second_id', nullable: false })
  secondId: string;

  @Column('boolean', { name: 'is_completed', nullable: false, default: false })
  isCompleted: boolean;
}
