import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../logger/logger.service';
import { TasksRepository } from '../../repositories/tasks.repository';
import { TaskEntity } from '../../entities/Task.entity';
import { TaskDataAdminObjectSubmitRenterInterface } from '../../interfaces/TaskData.interface';
import { ObjectMatchesForLandlordService } from '../../../api/landlord-renter-matches/object-matches.for-landlord.service';
import { MatchStatusEnumType } from '../../../api/landlord-renter-matches/interfaces/landlord-renter-matches.types';
import { TasksQueueBaseService } from '../tasks-queue-base.service';

@Injectable()
export class TasksAdminObjectSubmitRenterWorkerService extends TasksQueueBaseService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private readonly tasksRepository: TasksRepository,

    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
  ) {
    super();
    this.THROTTLE_MS = 1500;
    this.THROTTLE_CHUNK_LENGTH = 10;

    this.logger.setContext(this.constructor.name);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkTasks(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoAdminObjectSubmitRenter()) as TaskEntity<TaskDataAdminObjectSubmitRenterInterface>[];

    const action = this.processTasks.bind(this);
    await this.runTasksInQueues(waitingTasks, action);
  }

  public async processTasks(tasks: TaskEntity<TaskDataAdminObjectSubmitRenterInterface>[]): Promise<void> {
    if (!tasks.length) {
      return;
    }

    await this.connection.transaction(async entityManager => {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const { data: taskData, id: taskId } = task;
        await this.objectMatchesForLandlordService.changeLandlordStatusOfObject(
          {
            renterId: taskData.renterId,
            landlordObjectId: taskData.landlordObjectId,
            landlordStatus: MatchStatusEnumType.resolved,
          },
          entityManager,
        );
        await entityManager.getCustomRepository(TasksRepository).setTaskCompleted(taskId);

        this.logger.info(
          `Contacts of object ${taskData.landlordObjectId} was sent to renter ${taskData.renterId}`,
        );
      }
    });
  }
}
