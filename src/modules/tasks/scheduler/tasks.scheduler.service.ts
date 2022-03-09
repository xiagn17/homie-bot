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

const ONE_DAY_TIMESTAMP = 24 * 60 * 60 * 1000;
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
    data: TaskDataLandlordRenewNotificationInterface,
    customDate?: Date,
  ): Promise<void> {
    const type = TaskTypeEnumInterface.landlord_renew_notification;
    const date = customDate ?? new Date(Date.now() + ONE_DAY_TIMESTAMP);
    const prevTask = await this.tasksRepository.findOne({
      where: { type: type, data: { landlordObjectId: data.landlordObjectId }, completedAt: null },
    });
    if (!prevTask) {
      await this.tasksRepository.createAndSave(type, date, data);
      return;
    }
    await this.tasksRepository.update(prevTask.id, { scheduledFor: date });
  }

  async setAdminObjectSubmitRenter(
    data: TaskDataAdminObjectSubmitRenterInterface,
    customDate?: Date,
  ): Promise<void> {
    const type = TaskTypeEnumInterface.admin_object_submit_renter;
    const date = customDate ?? new Date(Date.now() + EIGHT_HOURS_TIMESTAMP);
    await this.tasksRepository.createAndSave(type, date, data);
  }

  async removeAdminObjectSubmitRenter(data: TaskDataAdminObjectSubmitRenterInterface): Promise<void> {
    await this.tasksRepository.delete({
      type: TaskTypeEnumInterface.admin_object_submit_renter,
      data: data,
    });
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
