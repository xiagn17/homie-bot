import { EntityRepository, Repository } from 'typeorm';
import { TelegramUser } from '../../entities/users/TelegramUser';

@EntityRepository(TelegramUser)
export class TelegramUsersRepository extends Repository<TelegramUser> {
  createUser(telegramUser: Partial<TelegramUser>): Promise<TelegramUser> {
    return this.save(this.create(telegramUser));
  }

  findByChatIdWithRenter(chatId: string): Promise<TelegramUser> {
    return this.createQueryBuilder('telegramUser')
      .where('telegramUser.chatId = :chatId', { chatId })
      .leftJoinAndSelect('telegramUser.renter', 'renter')
      .getOneOrFail();
  }
}
