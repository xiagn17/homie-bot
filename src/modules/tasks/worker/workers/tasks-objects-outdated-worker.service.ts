import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../logger/logger.service';
import {
  LandlordObjectIdsDataRaw,
  LandlordObjectsRepository,
} from '../../../api/landlord-objects/repositories/landlord-objects.repository';
import { TasksQueueBaseService } from '../tasks-queue-base.service';
import { LandlordObjectRenterMatchesRepository } from '../../../api/landlord-renter-matches/repositories/landlordObjectRenterMatches';
import { TasksSchedulerService } from '../../scheduler/tasks.scheduler.service';
import { LandlordObjectsSerializer } from '../../../api/landlord-objects/landlord-objects.serializer';
import {
  BROADCAST_OBJECT_OUTDATED_TO_LANDLORD_EVENT_NAME,
  BroadcastObjectOutdatedPushEvent,
} from '../../../bot/broadcast/events/broadcast-object-outdated.event';

@Injectable()
export class TasksObjectsOutdatedWorkerService extends TasksQueueBaseService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private readonly tasksSchedulerService: TasksSchedulerService,
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
    const outdatedObjectIds = await this.connection
      .getCustomRepository(LandlordObjectsRepository)
      .getOutdatedObjects();

    const action = this.processTasks.bind(this);

    await this.runTasksInQueues(outdatedObjectIds, action);
  }

  private async processTasks(outdatedObjectIds: LandlordObjectIdsDataRaw[]): Promise<void> {
    if (!outdatedObjectIds.length) {
      return;
    }

    await this.connection.transaction(async entityManager => {
      const processTasks = outdatedObjectIds.map(async ({ landlordObjectId }) => {
        const landlordObject = await entityManager
          .getCustomRepository(LandlordObjectsRepository)
          .getFullObject(landlordObjectId);

        await entityManager
          .getCustomRepository(LandlordObjectRenterMatchesRepository)
          .deleteUnprocessedRentersForObject(landlordObject.id);
        await this.tasksSchedulerService.removeTasksAfterStopObject(landlordObject.id);

        const object = this.landlordObjectsSerializer.toResponse(landlordObject);
        await this.eventEmitter.emitAsync(
          BROADCAST_OBJECT_OUTDATED_TO_LANDLORD_EVENT_NAME,
          new BroadcastObjectOutdatedPushEvent({
            object: object,
            chatId: landlordObject.telegramUser.chatId,
          }),
        );
      });

      await Promise.all(processTasks);
    });
  }
}
