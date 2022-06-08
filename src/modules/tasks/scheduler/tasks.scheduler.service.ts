import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskTypeEnumInterface } from '../interfaces/TaskTypeEnum.interface';
import {
  TaskDataAdminObjectSubmitRenterInterface,
  TaskDataLandlordRenewNotificationInterface,
  TaskDataNewObjectToRenterInterface,
} from '../interfaces/TaskData.interface';
import { LandlordObjectEntity } from '../../api/landlord-objects/entities/LandlordObject.entity';
import { getObjectRenewTimestamp } from '../../api/landlord-objects/constants/landlord-object-active-time.constant';

const EIGHT_HOURS_TIMESTAMP = 8 * 60 * 60 * 1000;

@Injectable()
export class TasksSchedulerService {
  constructor(
    private logger: LoggerService,
    private tasksRepository: TasksRepository,
    private readonly entityManager: EntityManager,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async setTaskLandlordRenewNotification(
    landlordObject: LandlordObjectEntity,
    customDate?: Date,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    const data: TaskDataLandlordRenewNotificationInterface = {
      landlordObjectId: landlordObject.id,
    };
    const type = TaskTypeEnumInterface.landlord_renew_notification;
    const delay = getObjectRenewTimestamp(landlordObject.objectType);
    const date = customDate ?? new Date(Date.now() + delay);
    const prevTask = await entityManager.getCustomRepository(TasksRepository).findOne({
      where: { type: type, data: data, completedAt: null },
    });
    if (!prevTask) {
      await entityManager.getCustomRepository(TasksRepository).createAndSave(type, date, data);
      return;
    }
    await entityManager.getCustomRepository(TasksRepository).update(prevTask.id, { scheduledFor: date });
  }

  async setAdminObjectSubmitRenter(
    data: TaskDataAdminObjectSubmitRenterInterface,
    customDate?: Date,
  ): Promise<void> {
    const type = TaskTypeEnumInterface.admin_object_submit_renter;
    const date = customDate ?? new Date(Date.now() + EIGHT_HOURS_TIMESTAMP);
    await this.tasksRepository.createAndSave(type, date, data);
  }

  async setPushNewObjectToRenter(data: TaskDataNewObjectToRenterInterface): Promise<void> {
    const isExistsOtherObjectPush = await this.tasksRepository.isExistsOtherObjectPushToRenter(data.chatId);
    if (isExistsOtherObjectPush) {
      return;
    }
    const type = TaskTypeEnumInterface.new_object_push_to_renters;
    const date = new Date();
    await this.tasksRepository.createAndSave(type, date, data);
  }

  async removePushNewObjectToRenter(data: TaskDataNewObjectToRenterInterface): Promise<void> {
    await this.tasksRepository.delete({
      type: TaskTypeEnumInterface.new_object_push_to_renters,
      data: data,
    });
  }

  async removeTasksAfterStopObject(
    landlordObjectId: string,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    await entityManager.getCustomRepository(TasksRepository).removeObjectTasksAfterStop(landlordObjectId);
  }

  async removeTasksAfterStopRenter(
    renterId: string,
    entityManager: EntityManager = this.entityManager,
  ): Promise<void> {
    await entityManager.getCustomRepository(TasksRepository).removeRenterTasksAfterStop(renterId);
  }
}
