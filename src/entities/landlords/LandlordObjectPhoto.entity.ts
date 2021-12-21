import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LandlordObjectEntity } from './LandlordObject.entity';

@Entity({ name: 'landlord_object_photos' })
@Unique(['photoUrl'])
export class LandlordObjectPhotoEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'photo_id' })
  id: string;

  @Column({ type: 'varchar', name: 'photo_url', nullable: false })
  photoUrl: string;

  @Column('uuid', { name: 'landlord_object_id', nullable: false })
  landlordObjectId: string;

  @ManyToOne(() => LandlordObjectEntity)
  @JoinColumn({ name: 'landlord_object_id' })
  landlordObject: LandlordObjectEntity;
}
