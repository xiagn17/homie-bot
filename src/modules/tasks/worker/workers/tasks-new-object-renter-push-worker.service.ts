import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../logger/logger.service';
import { TasksRepository } from '../../repositories/tasks.repository';
import { LandlordObjectsRepository } from '../../../api/landlord-objects/repositories/landlord-objects.repository';
import { TaskEntity } from '../../entities/Task.entity';
import { TaskDataNewObjectToRenterInterface } from '../../interfaces/TaskData.interface';
import { LandlordObjectsSerializer } from '../../../api/landlord-objects/landlord-objects.serializer';
import {
  BROADCAST_NEW_OBJECT_TO_RENTER_EVENT_NAME,
  BroadcastNewObjectToRenterPushEvent,
} from '../../../bot/broadcast/events/broadcast-new-object-renter-push.event';
import { TasksQueueBaseService } from '../tasks-queue-base.service';

@Injectable()
export class TasksNewObjectRenterPushWorkerService extends TasksQueueBaseService {
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

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkTasks(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoNewObjectToRenter()) as TaskEntity<TaskDataNewObjectToRenterInterface>[];

    const action = this.processTasks.bind(this);

    await this.runTasksInQueues(waitingTasks, action);
  }

  private async processTasks(tasks: TaskEntity<TaskDataNewObjectToRenterInterface>[]): Promise<void> {
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
          BROADCAST_NEW_OBJECT_TO_RENTER_EVENT_NAME,
          new BroadcastNewObjectToRenterPushEvent({
            object: object,
            chatId: taskData.chatId,
          }),
        );

        await entityManager.getCustomRepository(TasksRepository).setTaskCompleted(taskId);

        this.logger.info(`PUSH event for new object to renter ${taskData.chatId} was sent just now`);
      });

      await Promise.all(processTasks);
    });
  }
}
