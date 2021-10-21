import { EntityRepository, Repository } from 'typeorm';
import { TelegramUser } from '../../entities/users/TelegramUser';

@EntityRepository(TelegramUser)
export class TelegramUsersRepository extends Repository<TelegramUser> {
  createUser(telegramUser: Partial<TelegramUser>): Promise<TelegramUser> {
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
}
