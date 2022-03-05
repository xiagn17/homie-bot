import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { RentersModule } from '../renters/renters.module';
import { LandlordObjectsModule } from '../landlord-objects/landlord-objects.module';
import { TasksSchedulerModule } from '../../tasks/scheduler/tasks.scheduler.module';
import { ObjectMatchesForLandlordService } from './object-matches.for-landlord.service';
import { ObjectMatchesForRenterService } from './object-matches.for-renter.service';

@Module({
  imports: [
    LoggerModule,
    TasksSchedulerModule,

    // todo[TECH] remove this shit
    forwardRef(() => RentersModule),
    forwardRef(() => LandlordObjectsModule),
  ],
  controllers: [],
  providers: [ObjectMatchesForLandlordService, ObjectMatchesForRenterService],
  exports: [ObjectMatchesForLandlordService, ObjectMatchesForRenterService],
})
export class LandlordRenterMatchesModule {}
