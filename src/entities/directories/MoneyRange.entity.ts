import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../renters/Renter.entity';

export enum MoneyRangeEnumType {
  prelow = '15000-20000',
  low = '20000-25000',
  middle = '25000-30000',
  high = '30000-40000',
}

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
