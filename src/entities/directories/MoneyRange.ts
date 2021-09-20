import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Renter } from '../users/Renter';
import { MoneyRangeEnumType } from '../../modules/renters/renters.type';

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

  @OneToMany(() => Renter, renter => renter.moneyRange)
  renters: Renter[];
}
