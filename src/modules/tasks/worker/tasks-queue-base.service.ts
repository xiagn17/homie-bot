import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../entities/Task.entity';

@Injectable()
export class TasksQueueBaseService {
  protected THROTTLE_CHUNK_LENGTH: number = 25;

  protected THROTTLE_MS: number = 1000;

  protected async runTasksInQueues(
    waitingTasks: TaskEntity<any>[],
    action: (chunks: TaskEntity<any>[]) => Promise<void>,
  ): Promise<void> {
    const tasksByChunks = this.reduceTasksByChunks(waitingTasks);
    for (let i = 0; i < tasksByChunks.length; i++) {
      await action(tasksByChunks[i]);
      await new Promise(res => setTimeout(res, this.THROTTLE_MS));
    }
  }

  private reduceTasksByChunks(tasks: TaskEntity[]): TaskEntity[][] {
    return tasks.reduce<TaskEntity[][]>(
      (acc, cur) => {
        if (acc[acc.length - 1].length === this.THROTTLE_CHUNK_LENGTH) {
          acc.push([]);
        }
        acc[acc.length - 1].push(cur);
        return acc;
      },
      [[]],
    );
  }
}
