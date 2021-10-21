import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Renter } from './Renter';

@Entity({ name: 'telegram_users' })
export class TelegramUser {
  @PrimaryGeneratedColumn('uuid', { name: 'telegram_user_id' })
  readonly id: string;

  @Column({ type: 'varchar', name: 'username', nullable: true, unique: true })
  readonly username: string | null;

  @Column({ type: 'varchar', name: 'chat_id', nullable: false, unique: true })
  readonly chatId: string;

  @OneToOne(() => Renter, renter => renter.telegramUser)
  readonly renter: Renter | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: 'now()' })
  readonly createdAt: Date;

  @Column({ name: 'archived_at', type: 'timestamptz' })
  readonly archivedAt: Date | null;
}
