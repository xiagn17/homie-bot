import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TelegramUserEntity } from '../../telegram-bot/entities/TelegramUser.entity';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'review_id' })
  id: string;

  @Column({ name: 'reason', type: 'varchar' })
  reason: string | null;

  @Column({ name: 'stars', type: 'int' })
  stars: number | null;

  @Column({ name: 'telegram_user_id', type: 'uuid' })
  telegramUserId: string;

  @JoinColumn({ name: 'telegram_user_id' })
  @OneToOne(() => TelegramUserEntity)
  telegramUser: TelegramUserEntity;
}
