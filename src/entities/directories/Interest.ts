import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InterestEnumType } from '../../modules/tilda-form/tilda-form.types';
import { Renter } from '../users/Renter';

@Entity({ name: 'directory_interests' })
export class Interest {
  @PrimaryGeneratedColumn('uuid', { name: 'interest_id' })
  readonly id: string;

  @Column({
    name: 'interest',
    type: 'varchar',
    nullable: false,
  })
  interest: InterestEnumType;

  @ManyToMany(() => Renter)
  @JoinTable({
    name: 'renters_j_directory_interests',
    joinColumn: { name: 'interest_id' },
    inverseJoinColumn: { name: 'renter_id' },
  })
  renters: Renter[];
}
