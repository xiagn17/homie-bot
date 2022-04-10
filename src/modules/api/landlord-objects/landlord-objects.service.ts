import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { TasksSchedulerService } from '../../tasks/scheduler/tasks.scheduler.service';
import { LandlordObjectRenterMatchesRepository } from '../landlord-renter-matches/repositories/landlordObjectRenterMatches';
import { ObjectMatchesForLandlordService } from '../landlord-renter-matches/object-matches.for-landlord.service';
import { TelegramUsersRepository } from '../telegram-bot/repositories/telegramUsers.repository';
import { LandlordObjectsRepository } from './repositories/landlord-objects.repository';
import { LandlordObjectPhotoEntity } from './entities/LandlordObjectPhoto.entity';
import { LandlordObjectEntity } from './entities/LandlordObject.entity';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { RenewLandlordObjectDto } from './dto/renew-landlord-object.dto';
import { ArchiveLandlordObjectDto } from './dto/archive-landlord-object.dto';
import {
  ApiLandlordObjectDraft,
  ApiLandlordObjectResumeType,
  ApiObjectResponse,
} from './interfaces/landlord-objects.type';
import { LandlordObjectsControlService } from './landlord-objects.control.service';

@Injectable()
export class LandlordObjectsService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private tasksSchedulerService: TasksSchedulerService,

    private landlordObjectsSerializer: LandlordObjectsSerializer,
    private landlordObjectsControlService: LandlordObjectsControlService,
    private readonly objectMatchesForLandlordService: ObjectMatchesForLandlordService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async createObject(landlordObjectDraft: ApiLandlordObjectDraft): Promise<LandlordObjectEntity> {
    const isAdmin = await this.connection
      .getCustomRepository(TelegramUsersRepository)
      .isUserAdmin(landlordObjectDraft.chatId);

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

      return manager.getCustomRepository(LandlordObjectsRepository).getFullObject(landlordObjectEntity.id);
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
    const isUserAdmin = await this.connection
      .getCustomRepository(TelegramUsersRepository)
      .isUserAdmin(chatId);
    if (isUserAdmin) {
      return null;
    }
    try {
      const object = await this.connection.getCustomRepository(LandlordObjectsRepository).getByChatId(chatId);
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

  async getLatestObjects(): Promise<ApiObjectResponse[]> {
    const objects = await this.connection.getCustomRepository(LandlordObjectsRepository).find({
      order: {
        number: 'DESC',
      },
      take: 100,
      relations: ['photos'],
    });
    return objects.map(o => this.landlordObjectsSerializer.toResponse(o));
  }

  async renewObject(renewLandlordObjectDto: RenewLandlordObjectDto): Promise<string> {
    const landlordObject = await this.connection
      .getCustomRepository(LandlordObjectsRepository)
      .getByChatId(renewLandlordObjectDto.chatId);
    await this.connection.getCustomRepository(LandlordObjectsRepository).renewObject(landlordObject.id);
    await this.tasksSchedulerService.setTaskLandlordRenewNotification(landlordObject);

    return landlordObject.id;
  }

  async stopObject(
    archiveLandlordObjectDto: ArchiveLandlordObjectDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const action = async (manager: EntityManager): Promise<void> => {
      const landlordObject = await manager
        .getCustomRepository(LandlordObjectsRepository)
        .getByChatId(archiveLandlordObjectDto.chatId);
      await manager.getCustomRepository(LandlordObjectsRepository).stopObject(landlordObject.id);
      await manager
        .getCustomRepository(LandlordObjectRenterMatchesRepository)
        .deleteUnprocessedRentersForObject(landlordObject.id);
      await this.tasksSchedulerService.removeTasksAfterStopObject(landlordObject.id, manager);
    };

    if (entityManager) {
      return action(entityManager);
    }
    return this.connection.transaction(action);
  }

  async resumeObject(landlordObjectResumeDto: ApiLandlordObjectResumeType): Promise<void> {
    const landlordObject = await this.connection
      .getCustomRepository(LandlordObjectsRepository)
      .getByChatId(landlordObjectResumeDto.chatId);

    await this.renewObject(landlordObjectResumeDto);
    await this.objectMatchesForLandlordService.matchObjectToRenters(landlordObject);
  }

  async deleteObject(chatId: string): Promise<void> {
    await this.connection.transaction(async entityManager => {
      const landlordObject = await entityManager
        .getCustomRepository(LandlordObjectsRepository)
        .getByChatId(chatId);
      await this.stopObject({ chatId }, entityManager);
      await entityManager.getCustomRepository(LandlordObjectsRepository).softDeleteObject(landlordObject.id);
    });
  }
}
