import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../logger/logger.module';
import { TasksRepository } from '../repositories/tasks.repository';
import { TasksSchedulerService } from './tasks.scheduler.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([TasksRepository])],
  providers: [TasksSchedulerService],
  exports: [TasksSchedulerService],
})
export class TasksSchedulerModule {}
