import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../../renters/entities/Renter.entity';
import { MoneyRangeEnumType } from '../interfaces/money-ranges.interface';

@Entity({ name: 'directory_money_ranges' })
export class MoneyRangeEntity {
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
