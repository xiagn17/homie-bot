import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RenterEntity } from '../users/Renter.entity';
import { MatchStatusEnumType } from '../../modules/api/renter-matches/renter-matches.type';

@Entity({ name: 'renter_matches' })
@Unique(['firstId', 'secondId'])
export class RenterMatch {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_match_id' })
  readonly id: string;

  @ManyToOne(() => RenterEntity)
  @JoinColumn({ name: 'first_id' })
  first: RenterEntity;

  @Column('uuid', { name: 'first_id', nullable: false })
  firstId: string;

  @ManyToOne(() => RenterEntity)
  @JoinColumn({ name: 'second_id' })
  second: RenterEntity;

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
