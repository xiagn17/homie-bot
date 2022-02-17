import { Module } from '@nestjs/common';
import { RenterObjectsService } from './renter-objects.service';
import { RentersObjectsKeyboardsModule } from './keyboards/renters-objects-keyboards.module';
import { RenterObjectsApiModule } from './api/renter-objects-api.module';
import { RenterObjectsTextsModule } from './texts/renter-objects-texts.module';

@Module({
  imports: [RentersObjectsKeyboardsModule, RenterObjectsApiModule, RenterObjectsTextsModule],
  providers: [RenterObjectsService],
  exports: [RenterObjectsService],
})
export class RenterObjectsModule {}
