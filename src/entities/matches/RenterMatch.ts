import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Renter } from '../users/Renter';
import { MatchStatusEnumType } from '../../modules/api/renter-matches/renter-matches.type';

@Entity({ name: 'renter_matches' })
@Unique(['firstId', 'secondId'])
export class RenterMatch {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_match_id' })
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

  @Column({
    type: 'enum',
    name: 'status',
    nullable: false,
    enum: MatchStatusEnumType,
  })
  status: MatchStatusEnumType;
}
