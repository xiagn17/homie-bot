import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RenterEntity } from '../renters/Renter.entity';
import { MatchStatusEnumType } from '../../modules/api/renter-matches/renter-matches.type';
import { LandlordObjectEntity } from '../landlord-objects/LandlordObject.entity';

@Entity({ name: 'landlord_object_renter_matches' })
@Unique(['landlordObjectId', 'renterId'])
export class LandlordObjectRenterMatchEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'match_id' })
  id: string;

  @Column('uuid', { name: 'renter_id', nullable: false })
  renterId: string;

  @ManyToOne(() => RenterEntity)
  @JoinColumn({ name: 'renter_id' })
  renter: RenterEntity;

  @Column('uuid', { name: 'landlord_object_id', nullable: false })
  landlordObjectId: string;

  @ManyToOne(() => LandlordObjectEntity)
  @JoinColumn({ name: 'landlord_object_id' })
  landlordObject: LandlordObjectEntity;

  @Column({
    type: 'enum',
    name: 'renter_status',
    nullable: false,
    enum: MatchStatusEnumType,
  })
  renterStatus: MatchStatusEnumType;

  @Column({
    type: 'enum',
    name: 'landlord_status',
    nullable: true,
    enum: MatchStatusEnumType,
  })
  landlordStatus: MatchStatusEnumType | null;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  readonly updatedAt: Date | null;
}
