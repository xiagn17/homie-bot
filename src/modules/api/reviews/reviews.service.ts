import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { ReviewEntity } from './entities/Review.entity';
import { ReviewReasons } from './interfaces/reviews.type';

@Injectable()
export class ReviewsService {
  constructor(private readonly connection: Connection) {}

  async addReason(chatId: string, reason: ReviewReasons): Promise<void> {
    const reviewRepository = this.connection.getRepository(ReviewEntity);
    const review = await this.findOrCreate(chatId);
    await reviewRepository.update(review, {
      reason: reason,
    });
  }

  async addStars(chatId: string, stars: number): Promise<void> {
    const reviewRepository = this.connection.getRepository(ReviewEntity);
    const review = await this.findOrCreate(chatId);
    await reviewRepository.update(review, {
      stars: stars,
    });
  }

  private async findOrCreate(chatId: string): Promise<ReviewEntity> {
    const reviewRepository = this.connection.getRepository(ReviewEntity);
    const review = await reviewRepository.findOne({
      where: {
        telegramUser: { chatId: chatId },
      },
      relations: ['telegramUser'],
    });
    if (review) {
      return review;
    }
    const telegramUser = await this.connection
      .getCustomRepository(TelegramUsersRepository)
      .findOneOrFail({ chatId });
    return reviewRepository.save(
      reviewRepository.create({
        telegramUserId: telegramUser.id,
      }),
    );
  }
}
