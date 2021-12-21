import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MatchStatusEnumType } from '../../modules/api/renter-matches/renter-matches.type';
import { RenterEntity } from '../renters/Renter.entity';

@Entity({ name: 'renter_matches' })
@Unique(['firstId', 'secondId'])
export class RenterMatchEntity {
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
