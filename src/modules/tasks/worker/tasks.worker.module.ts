import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../logger/logger.module';
import { TasksRepository } from '../repositories/tasks.repository';
import { LandlordRenterMatchesModule } from '../../api/landlord-renter-matches/landlord-renter-matches.module';
import { LandlordObjectsModule } from '../../api/landlord-objects/landlord-objects.module';
import { TasksWorkerService } from './tasks.worker.service';
import { TasksLandlordNotificationsWorkerService } from './actions/tasks-landlord-notifications.worker.service';
import { TasksAdminApproveObjectWorkerService } from './actions/tasks-admin-approve-object.worker.service';
import { TasksNewObjectRenterPushWorkerService } from './actions/tasks-new-object-renter-push-worker.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerModule,
    TypeOrmModule.forFeature([TasksRepository]),

    // for workers features
    LandlordRenterMatchesModule,
    LandlordObjectsModule,
  ],
  providers: [
    TasksWorkerService,
    TasksLandlordNotificationsWorkerService,
    TasksAdminApproveObjectWorkerService,
    TasksNewObjectRenterPushWorkerService,
  ],
  exports: [],
})
export class TasksWorkerModule {}
