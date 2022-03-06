import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { TaskEntity } from '../entities/Task.entity';
import { TaskTypeEnumInterface } from '../interfaces/TaskTypeEnum.interface';
import { TaskDataInterface } from '../interfaces/TaskData.interface';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
  createAndSave(
    type: TaskTypeEnumInterface,
    scheduledFor: Date,
    data: TaskDataInterface,
  ): Promise<TaskEntity> {
    return this.save(
      this.create({
        type: type,
        scheduledFor: scheduledFor,
        data: data,
      }),
    );
  }

  async setTaskCompleted(taskId: string): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        completedAt: new Date(),
      })
      .where('id = :taskId', { taskId })
      .execute();
  }

  getTodoLandlordRenewNotification(): Promise<TaskEntity[]> {
    return this.getTodoQuery()
      .andWhere('task.type = :type', {
        type: TaskTypeEnumInterface.landlord_notification,
      })
      .getMany();
  }

  getTodoAdminApproveObject(): Promise<TaskEntity[]> {
    return this.getTodoQuery()
      .andWhere('task.type = :type', {
        type: TaskTypeEnumInterface.admin_approve,
      })
      .getMany();
  }

  getTodoNewObjectToRenter(): Promise<TaskEntity[]> {
    return this.getTodoQuery()
      .andWhere('task.type = :type', {
        type: TaskTypeEnumInterface.new_object_pushes_to_renters,
      })
      .getMany();
  }

  async isExistsOtherObjectPushToRenter(renterChatId: string): Promise<boolean> {
    const type = TaskTypeEnumInterface.new_object_pushes_to_renters;
    const result: [{ exists: boolean }] = await this.query(`
        SELECT COUNT(task_id) > 0 as "exists" FROM tasks
        WHERE completed_at IS NULL
        AND type = '${type}'
        AND data ->> 'chatId' = '${renterChatId}'
    `);
    return result[0].exists;
  }

  private getTodoQuery(): SelectQueryBuilder<TaskEntity> {
    return this.createQueryBuilder('task')
      .where('task.completedAt IS NULL')
      .andWhere('task.scheduledFor <= NOW()');
  }
}
