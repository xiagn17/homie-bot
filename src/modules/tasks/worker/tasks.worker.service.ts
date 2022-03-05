import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskEntity } from '../entities/Task.entity';
import {
  TaskDataAdminApproveObjectInterface,
  TaskDataLandlordRenewNotificationInterface,
  TaskDataNewObjectToRenterInterface,
} from '../interfaces/TaskData.interface';
import { TasksLandlordNotificationsWorkerService } from './actions/tasks-landlord-notifications.worker.service';
import { TasksAdminApproveObjectWorkerService } from './actions/tasks-admin-approve-object.worker.service';
import { TasksNewObjectRenterPushWorkerService } from './actions/tasks-new-object-renter-push-worker.service';

@Injectable()
export class TasksWorkerService {
  private CHUNK_LENGTH: number = 5;

  constructor(
    private logger: LoggerService,
    private tasksRepository: TasksRepository,
    private tasksLandlordNotificationsWorkerService: TasksLandlordNotificationsWorkerService,
    private tasksAdminApproveObjectWorkerService: TasksAdminApproveObjectWorkerService,
    private tasksNewObjectRenterPushWorkerService: TasksNewObjectRenterPushWorkerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkLandlordRenewNotifications(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoLandlordRenewNotification()) as TaskEntity<TaskDataLandlordRenewNotificationInterface>[];

    const action = this.tasksLandlordNotificationsWorkerService.processTasksLandlordNotifications.bind(
      this.tasksLandlordNotificationsWorkerService,
    );
    await this.runTasksInQueues(waitingTasks, action);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAdminApproveObject(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoAdminApproveObject()) as TaskEntity<TaskDataAdminApproveObjectInterface>[];

    const action = this.tasksAdminApproveObjectWorkerService.processTasksAdminApproveObject.bind(
      this.tasksAdminApproveObjectWorkerService,
    );
    await this.runTasksInQueues(waitingTasks, action);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async newObjectsToRenterPushes(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoNewObjectToRenter()) as TaskEntity<TaskDataNewObjectToRenterInterface>[];

    const action = this.tasksNewObjectRenterPushWorkerService.processTasksObjectToRenterPush.bind(
      this.tasksNewObjectRenterPushWorkerService,
    );

    await this.runTasksInQueues(waitingTasks, action, {
      tasksNumber: 25,
      throttle: 1000,
    });
  }

  private async runTasksInQueues(
    waitingTasks: TaskEntity<any>[],
    action: (chunks: TaskEntity<any>[]) => Promise<void>,
    options?: {
      throttle: number;
      tasksNumber: number;
    },
  ): Promise<void> {
    const tasksByChunks = this.reduceTasksByChunks(waitingTasks, options?.tasksNumber);
    for (let i = 0; i < tasksByChunks.length; i++) {
      await action(tasksByChunks[i]);
      if (options?.throttle) {
        await new Promise(res => setTimeout(res, options.throttle));
      }
    }
  }

  private reduceTasksByChunks(tasks: TaskEntity[], chunkLength?: number): TaskEntity[][] {
    return tasks.reduce<TaskEntity[][]>(
      (acc, cur) => {
        if (acc[acc.length - 1].length === chunkLength ?? this.CHUNK_LENGTH) {
          acc.push([]);
        }
        acc[acc.length - 1].push(cur);
        return acc;
      },
      [[]],
    );
  }
}
