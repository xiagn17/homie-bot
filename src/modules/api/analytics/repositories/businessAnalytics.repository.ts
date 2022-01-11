import { EntityRepository, Repository } from 'typeorm';
import { BusinessAnalyticsEntity } from '../entities/BusinessAnalytics.entity';
import { BusinessAnalyticsFieldsEnumType } from '../interfaces/analytics.type';

@EntityRepository(BusinessAnalyticsEntity)
export class BusinessAnalyticsRepository extends Repository<BusinessAnalyticsEntity> {
  createAnalytics(businessAnalytics: Partial<BusinessAnalyticsEntity>): Promise<BusinessAnalyticsEntity> {
    return this.save(this.create(businessAnalytics));
  }

  findByTelegramChatId(chatId: string): Promise<BusinessAnalyticsEntity | undefined> {
    return this.createQueryBuilder('businessAnalytics')
      .innerJoin('businessAnalytics.telegramUser', 'telegramUser', 'telegramUser.chatId = :chatId', {
        chatId,
      })
      .getOne();
  }

  async updateField(
    businessAnalytics: BusinessAnalyticsEntity,
    field: BusinessAnalyticsFieldsEnumType,
  ): Promise<void> {
    const getUpdatePartialEntity = (): Partial<BusinessAnalyticsEntity> => {
      if (field === BusinessAnalyticsFieldsEnumType.start_fill_renter_info) {
        return { startFillRenterInfo: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.end_fill_renter_info) {
        return { endFillRenterInfo: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.next_step_renter_info) {
        return { nextStepRenterInfo: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.created_match) {
        return { createdMatch: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.showed_room_info) {
        return { showedRoomInfo: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.connected_by_room) {
        return { connectedByRoom: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.success_match) {
        return { successMatch: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.pay_match) {
        return { payMatch: true };
      }
      if (field === BusinessAnalyticsFieldsEnumType.pay_room_info) {
        return { payRoomInfo: true };
      }

      return { entered: true };
    };
    const updatingPartialEntity = getUpdatePartialEntity();
    await this.update(businessAnalytics.id, updatingPartialEntity);
  }
}
