import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TelegramUser } from '../users/TelegramUser';

@Entity({ name: 'business_analytics' })
export class BusinessAnalyticsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'business_analytics_id' })
  readonly id: string;

  @Column({ name: 'telegram_user_id', type: 'uuid', nullable: false, unique: true })
  readonly telegramUserId: string;

  @JoinColumn({ name: 'telegram_user_id' })
  @OneToOne(() => TelegramUser)
  readonly telegramUser: TelegramUser;

  @Column({ type: 'boolean', name: 'entered', nullable: false, default: true })
  readonly entered: boolean;

  @Column({ type: 'boolean', name: 'start_fill_renter_info', nullable: false, default: false })
  readonly startFillRenterInfo: boolean;

  @Column({ type: 'boolean', name: 'end_fill_renter_info', nullable: false, default: false })
  readonly endFillRenterInfo: boolean;

  @Column({ type: 'boolean', name: 'next_step_renter_info', nullable: false, default: false })
  readonly nextStepRenterInfo: boolean;

  @Column({ type: 'boolean', name: 'created_match', nullable: false, default: false })
  readonly createdMatch: boolean;

  @Column({ type: 'boolean', name: 'showed_room_info', nullable: false, default: false })
  readonly showedRoomInfo: boolean;

  @Column({ type: 'boolean', name: 'connected_by_room', nullable: false, default: false })
  readonly connectedByRoom: boolean;

  @Column({ type: 'boolean', name: 'success_match', nullable: false, default: false })
  readonly successMatch: boolean;

  @Column({ type: 'boolean', name: 'pay_match', nullable: false, default: false })
  readonly payMatch: boolean;

  @Column({ type: 'boolean', name: 'pay_room_info', nullable: false, default: false })
  readonly payRoomInfo: boolean;
}
