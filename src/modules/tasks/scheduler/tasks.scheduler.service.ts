import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskTypeEnumInterface } from '../interfaces/TaskTypeEnum.interface';
import {
  TaskDataAdminApproveObjectInterface,
  TaskDataLandlordRenewNotificationInterface,
  TaskDataNewObjectToRenterInterface,
} from '../interfaces/TaskData.interface';

const ONE_DAY_TIMESTAMP = 24 * 60 * 60 * 1000;
const EIGHT_HOURS_TIMESTAMP = 8 * 60 * 60 * 1000;

@Injectable()
export class TasksSchedulerService {
  constructor(private logger: LoggerService, private tasksRepository: TasksRepository) {
    this.logger.setContext(this.constructor.name);
  }

  async setTaskLandlordRenewNotification(
    data: TaskDataLandlordRenewNotificationInterface,
    customDate?: Date,
  ): Promise<void> {
    const type = TaskTypeEnumInterface.landlord_notification;
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

  async removeTasksAfterStopObject(landlordObjectId: string): Promise<void> {
    await this.tasksRepository.removeObjectTasksAfterStop(landlordObjectId);
  }

  async setAdminApproveObject(data: TaskDataAdminApproveObjectInterface, customDate?: Date): Promise<void> {
    const type = TaskTypeEnumInterface.admin_approve;
    const date = customDate ?? new Date(Date.now() + EIGHT_HOURS_TIMESTAMP);
    await this.tasksRepository.createAndSave(type, date, data);
  }

  async removeAdminApproveObject(data: TaskDataAdminApproveObjectInterface): Promise<void> {
    await this.tasksRepository.delete({
      type: TaskTypeEnumInterface.admin_approve,
      data: data,
    });
  }

  async setPushNewObjectToRenter(data: TaskDataNewObjectToRenterInterface): Promise<void> {
    const isExistsOtherObjectPush = await this.tasksRepository.isExistsOtherObjectPushToRenter(data.chatId);
    if (isExistsOtherObjectPush) {
      return;
    }
    const type = TaskTypeEnumInterface.new_object_pushes_to_renters;
    const date = new Date();
    await this.tasksRepository.createAndSave(type, date, data);
  }

  async removePushNewObjectToRenter(data: TaskDataNewObjectToRenterInterface): Promise<void> {
    await this.tasksRepository.delete({
      type: TaskTypeEnumInterface.new_object_pushes_to_renters,
      data: data,
    });
  }
}
