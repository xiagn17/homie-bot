import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MoneyRangeEnumType } from '../../modules/tilda-form/tilda-form.types';
import { Renter } from '../users/Renter';

@Entity({ name: 'directory_money_ranges' })
export class MoneyRange {
  @PrimaryGeneratedColumn('uuid', { name: 'money_range_id' })
  readonly id: string;

  @Column({
    name: 'range',
    type: 'varchar',
    nullable: false,
  })
  range: MoneyRangeEnumType;

  @ManyToMany(() => Renter)
  @JoinTable({
    name: 'renters_j_directory_money_ranges',
    joinColumn: { name: 'money_range_id' },
    inverseJoinColumn: { name: 'renter_id' },
  })
  renters: Renter[];
}
