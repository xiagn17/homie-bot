import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TasksRepository } from '../repositories/tasks.repository';
import { LandlordObjectsRepository } from '../../api/landlord-objects/repositories/landlord-objects.repository';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { TaskEntity } from '../entities/Task.entity';
import { TaskDataLandlordRenewNotificationInterface } from '../interfaces/TaskData.interface';

@Injectable()
export class TasksLandlordNotificationsWorkerService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,
    private flowXoService: FlowXoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async processTasksLandlordNotifications(
    tasks: TaskEntity<TaskDataLandlordRenewNotificationInterface>[],
  ): Promise<void> {
    if (!tasks.length) {
      return;
    }

    await this.connection.transaction(async entityManager => {
      const processTasks = tasks.map(async task => {
        const { data: taskData, id: taskId } = task;
        const landlordObject = await entityManager
          .getCustomRepository(LandlordObjectsRepository)
          .getFullObject(taskData.landlordObjectId);
        await this.flowXoService.notificationLandlordRenewObject(landlordObject, landlordObject.telegramUser);
        await entityManager.getCustomRepository(TasksRepository).setTaskCompleted(taskId);

        this.logger.info(`Renew event for landlordObjectId ${taskData.landlordObjectId} was sent just now`);
      });

      await Promise.all(processTasks);
    });
  }
}
