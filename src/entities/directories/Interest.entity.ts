import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RenterEntity } from '../renters/Renter.entity';

export enum InterestEnumType {
  clubs = 'Бары и клубы',
  sport = 'Спорт, йога',
  art = 'Литература, живопись',
  cinema = 'Кинематограф',
  music = 'Музыка',
  events = 'Техно вечеринки, фестивали',
  politics = 'Политика, финансы',
  fashion = 'Мода',
  cooking = 'Кулинария',
}

@Entity({ name: 'directory_interests' })
export class InterestEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'interest_id' })
  readonly id: string;

  @Column({
    name: 'interest',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  interest: InterestEnumType;

  @ManyToMany(() => RenterEntity)
  @JoinTable({
    name: 'renters_j_directory_interests',
    joinColumn: { name: 'interest_id' },
    inverseJoinColumn: { name: 'renter_id' },
  })
  renters: RenterEntity[];
}
