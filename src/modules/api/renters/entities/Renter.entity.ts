import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

import { GenderEnumType } from '../interfaces/renters.type';
import { TelegramUserEntity } from '../../telegram-bot/entities/TelegramUser.entity';
import { RenterInfoEntity } from './RenterInfo.entity';
import { RenterFiltersEntity } from './RenterFilters.entity';
import { RenterSettingsEntity } from './RenterSettings.entity';

@Entity({ name: 'renters' })
export class RenterEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'renter_id' })
  readonly id: string;

  @Column({
    type: 'enum',
    name: 'gender',
    nullable: false,
    enum: GenderEnumType,
  })
  gender: GenderEnumType;

  @Column({ name: 'telegram_user_id', type: 'uuid', nullable: false, unique: true })
  telegramUserId: string;

  @JoinColumn({ name: 'telegram_user_id' })
  @OneToOne(() => TelegramUserEntity)
  telegramUser: TelegramUserEntity;

  @OneToOne(() => RenterInfoEntity, info => info.renterEntity)
  renterInfoEntity: RenterInfoEntity | null;

  @OneToOne(() => RenterFiltersEntity, filters => filters.renterEntity)
  renterFiltersEntity: RenterFiltersEntity;

  @OneToOne(() => RenterSettingsEntity, settings => settings.renterEntity)
  renterSettingsEntity: RenterSettingsEntity;
}
