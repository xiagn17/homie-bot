import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { BusinessAnalyticsEntity } from '../../../entities/analytics/BusinessAnalytics.entity';
import { BusinessAnalyticsRepository } from '../../../repositories/analytics/businessAnalytics.repository';
import { AnalyticsChangeStatusDTO } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private logger: Logger, private entityManager: EntityManager) {
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

  // todo export to google sheets
  public async export(): Promise<void> {
    await new Promise(res => res(true));
    return;
  }
}