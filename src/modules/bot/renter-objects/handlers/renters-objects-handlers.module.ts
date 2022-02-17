import { Module } from '@nestjs/common';
import { RenterObjectsModule } from '../renter-objects.module';
import { RenterObjectsApiModule } from '../api/renter-objects-api.module';
import { RentersObjectsKeyboardsModule } from '../keyboards/renters-objects-keyboards.module';
import { RentersObjectsHandlersService } from './renters-objects-handlers.service';

@Module({
  imports: [RenterObjectsModule, RenterObjectsApiModule, RentersObjectsKeyboardsModule],
  providers: [RentersObjectsHandlersService],
  exports: [RentersObjectsHandlersService],
})
export class RentersObjectsHandlersModule {}
