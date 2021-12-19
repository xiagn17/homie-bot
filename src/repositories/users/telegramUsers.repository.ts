import { EntityRepository, Repository } from 'typeorm';
import { TelegramUserEntity } from '../../entities/users/TelegramUser.entity';

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
}
