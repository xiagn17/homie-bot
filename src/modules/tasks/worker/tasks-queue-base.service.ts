import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../entities/Task.entity';

@Injectable()
export class TasksQueueBaseService {
  protected THROTTLE_CHUNK_LENGTH: number = 25;

  protected THROTTLE_MS: number = 1000;

  protected async runTasksInQueues<T = TaskEntity<any>>(
    waitingTasks: T[],
    action: (chunks: T[]) => Promise<void>,
  ): Promise<void> {
    const tasksByChunks = this.reduceTasksByChunks(waitingTasks);
    for (let i = 0; i < tasksByChunks.length; i++) {
      console.log('action is started on ', i);
      await action(tasksByChunks[i]);
      console.log('action is ended on ', i);
      await new Promise(res => setTimeout(res, this.THROTTLE_MS));
    }
  }

  private reduceTasksByChunks<T = TaskEntity<any>>(tasks: T[]): T[][] {
    return tasks.reduce<T[][]>(
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
