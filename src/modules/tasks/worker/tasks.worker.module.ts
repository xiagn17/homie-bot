import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../logger/logger.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { TasksRepository } from '../repositories/tasks.repository';
import { LandlordRenterMatchesModule } from '../../api/landlord-renter-matches/landlord-renter-matches.module';
import { TasksWorkerService } from './tasks.worker.service';
import { TasksLandlordNotificationsWorkerService } from './tasks-landlord-notifications.worker.service';
import { TasksAdminApproveObjectWorkerService } from './tasks-admin-approve-object.worker.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerModule,
    TypeOrmModule.forFeature([TasksRepository]),

    // for workers features
    LandlordRenterMatchesModule,
    FlowXoModule,
  ],
  providers: [
    TasksWorkerService,
    TasksLandlordNotificationsWorkerService,
    TasksAdminApproveObjectWorkerService,
  ],
  exports: [],
})
export class TasksWorkerModule {}
