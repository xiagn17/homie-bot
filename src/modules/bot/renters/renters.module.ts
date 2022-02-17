import { Module } from '@nestjs/common';
import { RenterObjectsModule } from '../renter-objects/renter-objects.module';
import { RentersService } from './renters.service';
import { RentersKeyboardsModule } from './keyboards/renters-keyboards.module';
import { RentersApiModule } from './api/renters-api.module';
import { RentersTextsModule } from './texts/renters-texts.module';

@Module({
  imports: [RentersKeyboardsModule, RentersApiModule, RenterObjectsModule, RentersTextsModule],
  providers: [RentersService],
  exports: [RentersService],
})
export class RentersModule {}
