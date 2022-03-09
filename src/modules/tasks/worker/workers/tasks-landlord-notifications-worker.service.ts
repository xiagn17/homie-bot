import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../logger/logger.service';
import { TasksRepository } from '../../repositories/tasks.repository';
import { LandlordObjectsRepository } from '../../../api/landlord-objects/repositories/landlord-objects.repository';
import { TaskEntity } from '../../entities/Task.entity';
import { TaskDataLandlordRenewNotificationInterface } from '../../interfaces/TaskData.interface';
import { LandlordObjectsSerializer } from '../../../api/landlord-objects/landlord-objects.serializer';
import {
  BROADCAST_RENEW_OBJECT_EVENT_NAME,
  BroadcastRenewObjectEvent,
} from '../../../bot/broadcast/events/broadcast-renew-object.event';
import { TasksQueueBaseService } from '../tasks-queue-base.service';

@Injectable()
export class TasksLandlordNotificationsWorkerService extends TasksQueueBaseService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private readonly tasksRepository: TasksRepository,

    private readonly landlordObjectsSerializer: LandlordObjectsSerializer,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
    this.THROTTLE_MS = 1000;
    this.THROTTLE_CHUNK_LENGTH = 25;
    this.logger.setContext(this.constructor.name);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkTasks(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoLandlordRenewNotification()) as TaskEntity<TaskDataLandlordRenewNotificationInterface>[];

    const action = this.processTasks.bind(this);
    await this.runTasksInQueues(waitingTasks, action);
  }

  public async processTasks(tasks: TaskEntity<TaskDataLandlordRenewNotificationInterface>[]): Promise<void> {
    if (!tasks.length) {
      return;
    }

    await this.connection.transaction(async entityManager => {
      const processTasks = tasks.map(async task => {
        const { data: taskData, id: taskId } = task;
        const landlordObject = await entityManager
          .getCustomRepository(LandlordObjectsRepository)
          .getFullObject(taskData.landlordObjectId);
        const object = this.landlordObjectsSerializer.toResponse(landlordObject);

        await this.eventEmitter.emitAsync(
          BROADCAST_RENEW_OBJECT_EVENT_NAME,
          new BroadcastRenewObjectEvent({
            object: object,
            chatId: landlordObject.telegramUser.chatId,
          }),
        );

        await entityManager.getCustomRepository(TasksRepository).setTaskCompleted(taskId);

        this.logger.info(`Renew event for landlordObjectId ${taskData.landlordObjectId} was sent just now`);
      });

      await Promise.all(processTasks);
    });
  }
}
