import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Renter } from './Renter';

@Entity({ name: 'telegram_users' })
export class TelegramUser {
  @PrimaryGeneratedColumn('uuid', { name: 'telegram_user_id' })
  readonly id: string;

  @Column({ type: 'varchar', name: 'username', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', name: 'chat_id', nullable: false, unique: true })
  chatId: string;

  @OneToOne(() => Renter, renter => renter.telegramUser)
  renter: Renter;
}
