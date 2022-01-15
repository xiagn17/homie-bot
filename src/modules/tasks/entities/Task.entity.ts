import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskTypeEnumInterface } from '../interfaces/TaskTypeEnum.interface';
import { TaskDataInterface } from '../interfaces/TaskData.interface';

@Entity({ name: 'tasks' })
export class TaskEntity<T = TaskDataInterface> {
  @PrimaryGeneratedColumn('uuid', { name: 'task_id' })
  readonly id: string;

  @Column({ type: 'varchar', name: 'type' })
  type: TaskTypeEnumInterface;

  @Column({ type: 'jsonb', name: 'data' })
  data: T;

  @Column({ name: 'scheduled_for', type: 'timestamptz' })
  scheduledFor: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', default: 'NULL' })
  completedAt: Date | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: 'now()' })
  readonly createdAt: Date;
}
