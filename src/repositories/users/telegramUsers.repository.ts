import { EntityRepository, Repository } from 'typeorm';
import { TelegramUser } from '../../entities/users/TelegramUser';

@EntityRepository(TelegramUser)
export class TelegramUsersRepository extends Repository<TelegramUser> {
  createUser(telegramUser: Partial<TelegramUser>): Promise<TelegramUser> {
    return this.save(this.create(telegramUser));
  }

  getUserByChatId(chatId: string): Promise<TelegramUser> {
    return this.findOneOrFail({ chatId: chatId }, { relations: ['renter'] });
  }
}
