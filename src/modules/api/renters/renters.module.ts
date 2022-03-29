import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { TasksSchedulerModule } from '../../tasks/scheduler/tasks.scheduler.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './serializers/renters.serializer';
import { PaymentSucceededListener } from './listeners/payment-succeeded.listener';
import { RenterInfosSerializer } from './serializers/renter-infos.serializer';
import { RenterFiltersSerializer } from './serializers/renter-filters.serializer';

@Module({
  imports: [LoggerModule, forwardRef(() => LandlordRenterMatchesModule), TasksSchedulerModule],
  controllers: [],
  providers: [
    RentersService,
    RentersSerializer,
    PaymentSucceededListener,
    RenterInfosSerializer,
    RenterFiltersSerializer,
  ],
  exports: [RentersService, RentersSerializer, RenterInfosSerializer],
})
export class RentersModule {}
