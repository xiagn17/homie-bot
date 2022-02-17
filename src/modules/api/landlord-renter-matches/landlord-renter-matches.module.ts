import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { FlowXoModule } from '../../flow-xo/flow-xo.module';
import { RentersModule } from '../renters/renters.module';
import { LandlordObjectsModule } from '../landlord-objects/landlord-objects.module';
import { TasksSchedulerModule } from '../../tasks/scheduler/tasks.scheduler.module';
import { ObjectMatchesForLandlordService } from './object-matches.for-landlord.service';
import { ObjectMatchesForRenterService } from './object-matches.for-renter.service';
import { LandlordRenterMatchesController } from './landlord-renter-matches.controller';

@Module({
  imports: [
    LoggerModule,
    FlowXoModule,
    TasksSchedulerModule,

    // todo[TECH] remove this shit
    forwardRef(() => RentersModule),
    forwardRef(() => LandlordObjectsModule),
  ],
  controllers: [LandlordRenterMatchesController],
  providers: [ObjectMatchesForLandlordService, ObjectMatchesForRenterService],
  exports: [ObjectMatchesForLandlordService, ObjectMatchesForRenterService],
})
export class LandlordRenterMatchesModule {}
