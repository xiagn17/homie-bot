import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { MatchDataType } from '../api/renter-matches/renter-matches.type';
import { LandlordObjectEntity } from '../../entities/landlord-objects/LandlordObject.entity';
import { FlowXoRequests } from './flow-xo.requests';
import { FlowXoSerializer } from './flow-xo.serializer';
import { FlowXoRouteType } from './flow-xo.type';

const FLOW_URLS = {
  sendMatch: '/hooks/a/2mjzknbz',
  buyMatches: '/hooks/a/eaajwkyy',
  pushNotification: '/hooks/a/4xjkew94',
};

@Injectable()
export class FlowXoService {
  constructor(
    private logger: LoggerService,
    private flowXoRequests: FlowXoRequests,
    private flowXoSerializer: FlowXoSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async sendMessageWithMatch(matchData: MatchDataType, isExistingMatch: boolean): Promise<void> {
    const flowData = this.flowXoSerializer.prepareMatchData(matchData, isExistingMatch);
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.sendMatch);
  }

  public async sendRenterToMatchPayment(chatId: string, botId: string): Promise<void> {
    const flowData = this.flowXoSerializer.preparePayMatchData(chatId, botId);
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.buyMatches);
  }

  public async notificationApproveLandlordObjectToAdmin({ chatId, botId }: FlowXoRouteType): Promise<void> {
    const flowData = this.flowXoSerializer.prepareNotificationFlowData(
      {
        chatId,
        botId,
      },
      'admin_next_approve',
      'Тут оставили заявку на анкету Объекта. Чекни плиз!!!',
    );
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.pushNotification);
  }

  public async notificationApproveAdminToLandlord(
    isApproved: boolean,
    { chatId, botId }: FlowXoRouteType,
  ): Promise<void> {
    const msg = isApproved
      ? 'Модерация прошла успешно!<pre>\n</pre>' +
        'Теперь это объявление увидят наши пользователи. Как только вы получите первый отклик, я пришлю сюда анкету заинтересовавшегося!'
      : 'Ваше объявление не смогло пройти модерацию 😥<pre>\n</pre>' +
        'Попробуйте прислать более качественные фотографии! Часто причина отклонения именно в них 😉';
    const flowData = this.flowXoSerializer.prepareNotificationFlowData(
      {
        chatId,
        botId,
      },
      'landlord_got_approve',
      msg,
    );
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.pushNotification);
  }

  public async notificationNewLandlordObjectToRenter({ chatId, botId }: FlowXoRouteType): Promise<void> {
    const flowData = this.flowXoSerializer.prepareNotificationFlowData(
      {
        chatId,
        botId,
      },
      'rent_next_object',
      'У нас появился новый объект в базе специально для вас!',
    );
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.pushNotification);
  }

  public async notificationNewRenterToLandlord({ chatId, botId }: FlowXoRouteType): Promise<void> {
    const flowData = this.flowXoSerializer.prepareNotificationFlowData(
      {
        chatId,
        botId,
      },
      'landlord_next_renter',
      'Кто-то заинтересовался вашим объектом.',
    );
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.pushNotification);
  }

  public async notificationLandlordContactsToRenter(
    landlordObject: LandlordObjectEntity,
    { chatId, botId }: FlowXoRouteType,
  ): Promise<void> {
    const message =
      `<b>Есть контакт!</b><pre>\n</pre>` +
      `👋🏻 Имя: ${landlordObject.name}<pre>\n</pre>` +
      `🎊 Контакт: @${landlordObject.telegramUser.username ?? ''}<pre>\n</pre>` +
      `🌐 Номер телефона: ${landlordObject.phoneNumber}<pre>\n</pre>` +
      `<pre>\n</pre>` +
      `🏡 Объявление: #home${landlordObject.number}`;
    const flowData = this.flowXoSerializer.prepareNotificationFlowData(
      {
        chatId,
        botId,
      },
      'rent_landlord_contacts',
      message,
    );
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.pushNotification);
  }

  public async notificationLandlordRenewObject(
    landlordObject: LandlordObjectEntity,
    { chatId, botId }: FlowXoRouteType,
  ): Promise<void> {
    const message =
      `🧨 Упс, включился протокол самоуничтожения объявления. Только вы можете это остановить!<pre>\n</pre><pre>\n</pre>` +
      `❗️ Если объявление #home${landlordObject.number} еще актуально - нажмите <b>"актуально"</b>. В ином случае я сниму объявление с публикации. Через меню вы сможете снова его активировать.`;
    const flowData = this.flowXoSerializer.prepareNotificationFlowData(
      {
        chatId,
        botId,
      },
      'landlord_renew_object',
      message,
    );
    await this.flowXoRequests.runFlowAtUser(flowData, FLOW_URLS.pushNotification);
  }
}
