import { EntityRepository, Repository } from 'typeorm';
import { TelegramUserEntity } from '../entities/TelegramUser.entity';

@EntityRepository(TelegramUserEntity)
export class TelegramUsersRepository extends Repository<TelegramUserEntity> {
  createUser(telegramUser: Partial<TelegramUserEntity>): Promise<TelegramUserEntity> {
    return this.save(this.create(telegramUser));
  }

  async archiveUser(chatId: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        archivedAt: new Date(),
      })
      .where('chatId = :chatId', { chatId })
      .execute();
  }

  async unArchiveUser(chatId: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        archivedAt: null,
      })
      .where('chatId = :chatId', { chatId })
      .execute();
  }

  findByUsername(username: string): Promise<TelegramUserEntity> {
    return this.findOneOrFail({ username });
  }

  async getUsersCount(): Promise<number> {
    const query: string = `
        SELECT COUNT(telegram_user_id)::int as "count" FROM telegram_users;
    `;
    const res: [{ count: number }] = await this.query(query);
    return res[0].count;
  }
}
