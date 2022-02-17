import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessAnalyticsFieldsEnumType } from '../analytics/interfaces/analytics.type';
import { ObjectMatchesForRenterService } from '../landlord-renter-matches/object-matches.for-renter.service';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { RentersRepository } from './repositories/renters.repository';
import { RenterEntity } from './entities/Renter.entity';
import { RentersSerializer } from './serializers/renters.serializer';
import {
  CreateRenterDTO,
  CreateRenterInfoDto,
  UpdateRenterFiltersDto,
  UpdateRenterInfoDto,
} from './dto/renters.dto';
import { RenterSettingsRepository } from './repositories/renter-settings.repository';
import { RenterFiltersRepository } from './repositories/renter-filters.repository';
import { ApiRenterFull } from './interfaces/renters.type';
import { RenterInfosRepository } from './repositories/renter-infos.repository';
import { RenterInfosSerializer } from './serializers/renter-infos.serializer';
import { ApiRenterFullInfo, ApiRenterInfo } from './interfaces/renter-info.interface';
import { ApiRenterFilters } from './interfaces/renter-filters.interface';
import { RenterFiltersSerializer } from './serializers/renter-filters.serializer';

@Injectable()
export class RentersService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private rentersSerializer: RentersSerializer,
    private renterInfosSerializer: RenterInfosSerializer,
    private renterFiltersSerializer: RenterFiltersSerializer,
    private flowXoService: FlowXoService,

    private objectMatchesForRenterService: ObjectMatchesForRenterService,
    private analyticsService: AnalyticsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getRenter(id: string, entityManager: EntityManager = this.connection.manager): Promise<RenterEntity> {
    return entityManager.getCustomRepository(RentersRepository).getFullRenter(id);
  }

  public async getRenterByChatId(chatId: string): Promise<ApiRenterFull> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    return this.rentersSerializer.toFullResponse(renter);
  }

  public async isUserRenter(chatId: string): Promise<boolean> {
    try {
      await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async createRenter(renterDto: CreateRenterDTO): Promise<RenterEntity> {
    const renter = await this.connection.transaction<RenterEntity>(async manager => {
      const telegramUser = await manager
        .getRepository(TelegramUserEntity)
        .findOneOrFail({ chatId: renterDto.chatId, botId: renterDto.botId });

      const renterDbData = this.rentersSerializer.mapToDbData({
        renterDto,
        telegramUser,
      });

      const { id: renterId } = await manager
        .getCustomRepository(RentersRepository)
        .createWithRelations(renterDbData);
      await manager.getCustomRepository(RenterSettingsRepository).createWithRelations({ renterId: renterId });
      await manager.getCustomRepository(RenterFiltersRepository).createWithRelations({ renterId: renterId });

      return manager.getCustomRepository(RentersRepository).getFullRenter(renterId);
    });

    await this.analyticsService.changeStatus({
      chatId: renterDto.chatId,
      field: BusinessAnalyticsFieldsEnumType.end_fill_renter_info,
    });
    await this.objectMatchesForRenterService.matchRenterToObjects(renter);

    return renter;
  }

  async createInfo(renterInfoDto: CreateRenterInfoDto): Promise<ApiRenterInfo> {
    const renter = await this.getRenterByChatId(renterInfoDto.chatId);
    const dbData = this.renterInfosSerializer.mapToDbData({ renterInfoDto, renter });
    const renterInfoEntity = await this.connection
      .getCustomRepository(RenterInfosRepository)
      .createWithRelations(dbData);
    return this.renterInfosSerializer.toResponse(renterInfoEntity);
  }

  async isRenterInfoExists(chatId: string): Promise<boolean> {
    const renter = await this.getRenterByChatId(chatId);
    const renterInfoEntity = await this.connection
      .getCustomRepository(RenterInfosRepository)
      .findOne({ renterId: renter.id });
    return !!renterInfoEntity;
  }

  async getRenterInfo(chatId: string): Promise<ApiRenterFullInfo | undefined> {
    const renter = await this.getRenterByChatId(chatId);
    const renterInfo = await this.connection
      .getCustomRepository(RenterInfosRepository)
      .findOne({ renterId: renter.id });
    return renterInfo && this.renterInfosSerializer.toFullResponse(renterInfo, renter);
  }

  async updateRenterFilters(renterFiltersDto: UpdateRenterFiltersDto): Promise<ApiRenterFilters> {
    return this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(RenterFiltersRepository)
        .update({ renterId: renterFiltersDto.renterId }, renterFiltersDto);

      const renter = await entityManager
        .getCustomRepository(RentersRepository)
        .getFullRenter(renterFiltersDto.renterId);
      await this.objectMatchesForRenterService.recreateMatches(renter, entityManager);

      const filters = await entityManager
        .getCustomRepository(RenterFiltersRepository)
        .findOneOrFail({ renterId: renterFiltersDto.renterId });
      return this.renterFiltersSerializer.toResponse(filters);
    });
  }

  async updateRenterInfo(renterInfoDto: UpdateRenterInfoDto): Promise<void> {
    const { chatId, ...updatingProperties } = renterInfoDto;
    const renter = await this.getRenterByChatId(chatId);
    await this.connection.transaction(async entityManager => {
      await entityManager
        .getCustomRepository(RenterInfosRepository)
        .update({ renterId: renter.id }, updatingProperties);
    });
  }

  async getRenterFilters(chatId: string): Promise<ApiRenterFilters> {
    const renter = await this.getRenterByChatId(chatId);
    const filters = await this.connection
      .getCustomRepository(RenterFiltersRepository)
      .findOneOrFail({ renterId: renter.id });
    return this.renterFiltersSerializer.toResponse(filters);
  }

  public async addPaidContacts(
    telegramUserId: string,
    count: number,
    entityManager: EntityManager,
  ): Promise<void> {
    await entityManager.getCustomRepository(RenterSettingsRepository).addContacts(telegramUserId, count);
    const telegramUser = await entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOneOrFail({ id: telegramUserId });
    await this.flowXoService.notificationPaidContacts({
      chatId: telegramUser.chatId,
      botId: telegramUser.botId,
    });
  }

  public async addPrivateHelper(telegramUserId: string, entityManager: EntityManager): Promise<void> {
    await entityManager.getCustomRepository(RenterSettingsRepository).addPrivateHelper(telegramUserId);
    const telegramUser = await entityManager
      .getCustomRepository(TelegramUsersRepository)
      .findOneOrFail({ id: telegramUserId });
    console.log(telegramUser);
    // todo push купившему + админу с никнеймом
    // await this.flowXoService.notificationPaidContacts({
    //   chatId: telegramUser.chatId,
    //   botId: telegramUser.botId,
    // });
  }

  public async removeContact(renterId: string): Promise<void> {
    await this.connection.getCustomRepository(RenterSettingsRepository).removeContact(renterId);
  }
}
