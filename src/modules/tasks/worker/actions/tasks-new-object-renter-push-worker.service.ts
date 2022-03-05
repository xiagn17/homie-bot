import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
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

@Injectable()
export class TasksNewObjectRenterPushWorkerService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private readonly landlordObjectsSerializer: LandlordObjectsSerializer,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async processTasksObjectToRenterPush(
    tasks: TaskEntity<TaskDataNewObjectToRenterInterface>[],
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
