import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskEntity } from '../entities/Task.entity';
import { TaskDataAdminApproveObjectInterface } from '../interfaces/TaskData.interface';
import { MatchStatusEnumType } from '../../api/renter-matches/interfaces/renter-matches.type';
import { ObjectMatchesForLandlordService } from '../../api/landlord-renter-matches/object-matches.for-landlord.service';

@Injectable()
export class TasksAdminApproveObjectWorkerService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async processTasksAdminApproveObject(
    tasks: TaskEntity<TaskDataAdminApproveObjectInterface>[],
  ): Promise<void> {
    await this.connection.transaction(async entityManager => {
      const processTasks = tasks.map(async task => {
        const { data: taskData, id: taskId } = task;
        await this.objectMatchesForLandlordService.changeLandlordStatusOfObject({
          renterId: taskData.renterId,
          landlordObjectId: taskData.landlordObjectId,
          landlordStatus: MatchStatusEnumType.resolved,
        });
        await entityManager.getCustomRepository(TasksRepository).setTaskCompleted(taskId);

        this.logger.info(
          `Contacts of object ${taskData.landlordObjectId} was sent to renter ${taskData.renterId}`,
        );
      });

      await Promise.all(processTasks);
    });
  }
}
