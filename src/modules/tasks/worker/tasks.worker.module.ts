import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../logger/logger.module';
import { TasksRepository } from '../repositories/tasks.repository';
import { LandlordRenterMatchesModule } from '../../api/landlord-renter-matches/landlord-renter-matches.module';
import { LandlordObjectsModule } from '../../api/landlord-objects/landlord-objects.module';
import { TasksSchedulerModule } from '../scheduler/tasks.scheduler.module';
import { TasksLandlordNotificationsWorkerService } from './workers/tasks-landlord-notifications-worker.service';
import { TasksAdminObjectSubmitRenterWorkerService } from './workers/tasks-admin-object-submit-renter-worker.service';
import { TasksNewObjectRenterPushWorkerService } from './workers/tasks-new-object-renter-push-worker.service';
import { TasksObjectsOutdatedWorkerService } from './workers/tasks-objects-outdated-worker.service';
import { TasksSendMessageWorkerService } from './workers/tasks-send-message-worker.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerModule,
    TypeOrmModule.forFeature([TasksRepository]),

    // for workers features
    LandlordRenterMatchesModule,
    LandlordObjectsModule,
    TasksSchedulerModule,
  ],
  providers: [
    TasksLandlordNotificationsWorkerService,
    TasksAdminObjectSubmitRenterWorkerService,
    TasksNewObjectRenterPushWorkerService,
    TasksObjectsOutdatedWorkerService,
    TasksSendMessageWorkerService,
  ],
  exports: [],
})
export class TasksWorkerModule {}
