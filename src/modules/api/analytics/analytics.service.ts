import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { BusinessAnalyticsEntity } from './entities/BusinessAnalytics.entity';
import { BusinessAnalyticsRepository } from './repositories/businessAnalytics.repository';
import { AnalyticsChangeStatusDTO } from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private logger: LoggerService, private entityManager: EntityManager) {
    this.logger.setContext(this.constructor.name);
  }

  public async createForUser(telegramUserId: string): Promise<BusinessAnalyticsEntity> {
    const businessAnalytics = await this.entityManager
      .getCustomRepository(BusinessAnalyticsRepository)
      .createAnalytics({ telegramUserId });
    return businessAnalytics;
  }

  public async changeStatus(analyticsChangeStatusDTO: AnalyticsChangeStatusDTO): Promise<void> {
    const analytics = await this.entityManager
      .getCustomRepository(BusinessAnalyticsRepository)
      .findByTelegramChatId(analyticsChangeStatusDTO.chatId);
    if (!analytics) {
      this.logger.warn(`No analytics by chatId = ${analyticsChangeStatusDTO.chatId}`);
      throw new Error(`No analytics by chatId = ${analyticsChangeStatusDTO.chatId}`);
    }

    await this.entityManager
      .getCustomRepository(BusinessAnalyticsRepository)
      .updateField(analytics, analyticsChangeStatusDTO.field);
  }

  public async export(): Promise<void> {
    await new Promise(res => res(true));
    return;
  }
}
