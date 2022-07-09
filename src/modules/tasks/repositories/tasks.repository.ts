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
        type: TaskTypeEnumInterface.landlord_renew_notification,
      })
      .getMany();
  }

  getTodoNewObjectToRenter(): Promise<TaskEntity[]> {
    return this.getTodoQuery()
      .andWhere('task.type = :type', {
        type: TaskTypeEnumInterface.new_object_push_to_renters,
      })
      .getMany();
  }

  getTodoSendMessage(): Promise<TaskEntity[]> {
    return this.getTodoQuery()
      .andWhere('task.type = :type', {
        type: TaskTypeEnumInterface.send_message,
      })
      .getMany();
  }

  async isExistsOtherObjectPushToRenter(renterChatId: string): Promise<boolean> {
    const type = TaskTypeEnumInterface.new_object_push_to_renters;
    const result: [{ exists: boolean }] = await this.query(`
        SELECT COUNT(task_id) > 0 as "exists" FROM tasks
        WHERE completed_at IS NULL
        AND type = '${type}'
        AND data ->> 'chatId' = '${renterChatId}'
    `);
    return result[0].exists;
  }

  async removeObjectTasksAfterStop(landlordObjectId: string): Promise<void> {
    const types = [
      TaskTypeEnumInterface.new_object_push_to_renters,
      TaskTypeEnumInterface.landlord_renew_notification,
    ];
    const query = `
        DELETE FROM tasks
        WHERE data ->> 'landlordObjectId' = '${landlordObjectId}'
        AND completed_at IS NULL
        AND (type = '${types[0]}' OR type = '${types[1]}')
    `;
    await this.query(query);
  }

  async removeRenterTasksAfterStop(renterId: string): Promise<void> {
    const types = [TaskTypeEnumInterface.new_object_push_to_renters];
    const query = `
        DELETE FROM tasks
        WHERE data ->> 'renterId' = '${renterId}'
        AND completed_at IS NULL
        AND type = '${types[0]}'
    `;
    await this.query(query);
  }

  private getTodoQuery(): SelectQueryBuilder<TaskEntity> {
    return this.createQueryBuilder('task')
      .where('task.completedAt IS NULL')
      .andWhere('task.scheduledFor <= NOW()');
  }
}
