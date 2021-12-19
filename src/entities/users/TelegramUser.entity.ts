import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RenterEntity } from './Renter.entity';

@Entity({ name: 'telegram_users' })
@Unique(['username', 'botId', 'chatId'])
export class TelegramUserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'telegram_user_id' })
  readonly id: string;

  @Column({ type: 'varchar', name: 'username', nullable: true })
  readonly username: string | null;

  @Column({ type: 'varchar', name: 'bot_id', nullable: false })
  readonly botId: string;

  @Column({ type: 'varchar', name: 'chat_id', nullable: false })
  readonly chatId: string;

  @OneToOne(() => RenterEntity, renter => renter.telegramUser)
  readonly renter: RenterEntity | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: 'now()' })
  readonly createdAt: Date;

  @Column({ name: 'archived_at', type: 'timestamptz' })
  readonly archivedAt: Date | null;
}
