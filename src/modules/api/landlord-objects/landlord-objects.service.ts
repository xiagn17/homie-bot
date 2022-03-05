import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { LandlordObjectsRepository } from './repositories/landlord-objects.repository';
import { LandlordObjectPhotoEntity } from './entities/LandlordObjectPhoto.entity';
import { LandlordObjectEntity } from './entities/LandlordObject.entity';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { RenewLandlordObjectDto } from './dto/renew-landlord-object.dto';
import { ArchiveLandlordObjectDto } from './dto/archive-landlord-object.dto';
import { ApiLandlordObjectDraft, ApiObjectResponse } from './interfaces/landlord-objects.type';
import { LandlordObjectsControlService } from './landlord-objects.control.service';

@Injectable()
export class LandlordObjectsService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private telegramBotService: TelegramBotService,
    private tasksSchedulerService: TasksSchedulerService,

    private landlordObjectsSerializer: LandlordObjectsSerializer,
    private landlordObjectsControlService: LandlordObjectsControlService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async createObject(landlordObjectDraft: ApiLandlordObjectDraft): Promise<LandlordObjectEntity> {
    const { chatId: adminChatId } = await this.telegramBotService.getAdmin();
    const { chatId: subAdminChatId } = await this.telegramBotService.getSubAdmin();
    const isAdmin =
      adminChatId === landlordObjectDraft.chatId || subAdminChatId === landlordObjectDraft.chatId;

    const landlordObject = await this.connection.transaction(async manager => {
      const telegramUser = await manager
        .getRepository(TelegramUserEntity)
        .findOneOrFail({ chatId: landlordObjectDraft.chatId });

      const landlordObjectDbData = this.landlordObjectsSerializer.mapToDbData({
        landlordObjectDraft,
        telegramUser,
        isAdmin,
      });

      const landlordObjectEntity = await manager
        .getCustomRepository(LandlordObjectsRepository)
        .createWithRelations(landlordObjectDbData);

      // todo[TECH] заменить на просто массив, убрать отдельную таблицу с фотками (сделать как у рентера)
      const photoEntitiesCreatePromise = landlordObjectDraft.photoIds.map(photoId =>
        manager.save(
          manager.getRepository(LandlordObjectPhotoEntity).create({
            photoId,
            landlordObjectId: landlordObjectEntity.id,
          }),
        ),
      );
      await Promise.all(photoEntitiesCreatePromise);

      return this.getLandlordObject(landlordObjectEntity.id, manager);
    });

    if (isAdmin) {
      await this.landlordObjectsControlService.controlApprove({ id: landlordObject.id, isApproved: true });
    } else {
      const objectResponse = this.landlordObjectsSerializer.toResponse(landlordObject);
      await this.landlordObjectsControlService.notificationApproveLandlordObject(objectResponse);
    }

    return landlordObject;
  }

  async getObjectByChatId(chatId: string): Promise<ApiObjectResponse | null> {
    const isUserAdmin = await this.telegramBotService.isUserAdmin(chatId);
    if (isUserAdmin) {
      return null;
    }
    try {
      const object = (
        await this.connection.getCustomRepository(LandlordObjectsRepository).getByChatId(chatId)
      )[0];
      return this.landlordObjectsSerializer.toResponse(object);
    } catch (e) {
      return null;
    }
  }

  getLandlordObject(
    id: string,
    entityManager: EntityManager = this.connection.manager,
  ): Promise<LandlordObjectEntity> {
    return entityManager.getCustomRepository(LandlordObjectsRepository).getFullObject(id);
  }

  getAllObjects(): Promise<LandlordObjectEntity[]> {
    return this.connection.getCustomRepository(LandlordObjectsRepository).find({
      order: {
        number: 'DESC',
      },
    });
  }

  async renewObject(renewLandlordObjectDto: RenewLandlordObjectDto): Promise<string> {
    const landlordObject = (
      await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .getByChatId(renewLandlordObjectDto.chatId)
    )[0];
    await this.connection.getCustomRepository(LandlordObjectsRepository).renewObject(landlordObject.id);
    await this.tasksSchedulerService.setTaskLandlordRenewNotification({
      landlordObjectId: landlordObject.id,
    });

    return landlordObject.id;
  }

  async archiveObject(archiveLandlordObjectDto: ArchiveLandlordObjectDto): Promise<void> {
    const landlordObject = (
      await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .getByChatId(archiveLandlordObjectDto.chatId)
    )[0];
    await this.connection.getCustomRepository(LandlordObjectsRepository).archiveObject(landlordObject.id);
  }
}
