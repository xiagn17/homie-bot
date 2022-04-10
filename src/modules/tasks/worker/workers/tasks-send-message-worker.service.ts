import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../logger/logger.service';
import { TasksRepository } from '../../repositories/tasks.repository';
import { TaskEntity } from '../../entities/Task.entity';
import { TaskDataSendMessageInterface } from '../../interfaces/TaskData.interface';
import { TasksQueueBaseService } from '../tasks-queue-base.service';
import {
  BROADCAST_SEND_MESSAGE_TASK_EVENT_NAME,
  BroadcastSendMessageTaskEvent,
} from '../../../bot/broadcast/events/broadcast-send-message-user.event';

@Injectable()
export class TasksSendMessageWorkerService extends TasksQueueBaseService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private readonly tasksRepository: TasksRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
    this.THROTTLE_MS = 1000;
    this.THROTTLE_CHUNK_LENGTH = 25;
    this.logger.setContext(this.constructor.name);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkTasks(): Promise<void> {
    const waitingTasks =
      (await this.tasksRepository.getTodoSendMessage()) as TaskEntity<TaskDataSendMessageInterface>[];

    const action = this.processTasks.bind(this);
    await this.runTasksInQueues(waitingTasks, action);
  }

  public async processTasks(tasks: TaskEntity<TaskDataSendMessageInterface>[]): Promise<void> {
    if (!tasks.length) {
      return;
    }

    await this.connection.transaction(async entityManager => {
      const processTasks = tasks.map(async task => {
        const { data: taskData, id: taskId } = task;
        await this.eventEmitter.emitAsync(
          BROADCAST_SEND_MESSAGE_TASK_EVENT_NAME,
          new BroadcastSendMessageTaskEvent({
            message: taskData.message,
            chatId: taskData.chatId,
            markup: taskData.markup ? JSON.parse(taskData.markup) : undefined,
          }),
        );

        await entityManager.getCustomRepository(TasksRepository).setTaskCompleted(taskId);
        this.logger.info(`Send message event for task id ${taskId} was sent just now`);
      });

      await Promise.all(processTasks);
    });
  }
}
