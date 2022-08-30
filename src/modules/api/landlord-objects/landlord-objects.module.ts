import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { TasksSchedulerModule } from '../../tasks/scheduler/tasks.scheduler.module';
import { RentersModule } from '../renters/renters.module';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { LandlordObjectsControlService } from './landlord-objects.control.service';
import { LandlordObjectsController } from './landlord-objects.controller';

@Module({
  imports: [LoggerModule, TasksSchedulerModule, forwardRef(() => LandlordRenterMatchesModule), RentersModule],
  controllers: [LandlordObjectsController],
  providers: [LandlordObjectsService, LandlordObjectsSerializer, LandlordObjectsControlService],
  exports: [LandlordObjectsService, LandlordObjectsSerializer, LandlordObjectsControlService],
})
export class LandlordObjectsModule {}
