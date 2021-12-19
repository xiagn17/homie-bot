import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../users/Renter.entity';
import { MoneyRangeEnumType } from '../../modules/api/renters/renters.type';

@Entity({ name: 'directory_money_ranges' })
export class MoneyRange {
  @PrimaryGeneratedColumn('uuid', { name: 'money_range_id' })
  readonly id: string;

  @Column({
    name: 'range',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  range: MoneyRangeEnumType;

  @OneToMany(() => RenterEntity, renter => renter.moneyRange)
  renters: RenterEntity[];
}
