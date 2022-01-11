import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LandlordObjectEntity } from './LandlordObject.entity';

@Entity({ name: 'landlord_object_photos' })
@Unique(['photoId'])
export class LandlordObjectPhotoEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'photo_id' })
  id: string;

  @Column({ type: 'varchar', name: 'external_photo_id', nullable: false })
  photoId: string;

  @Column('uuid', { name: 'landlord_object_id', nullable: false })
  landlordObjectId: string;

  @ManyToOne(() => LandlordObjectEntity)
  @JoinColumn({ name: 'landlord_object_id' })
  landlordObject: LandlordObjectEntity;
}
