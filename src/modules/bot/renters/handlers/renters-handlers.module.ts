import { Module } from '@nestjs/common';
import { RentersModule } from '../renters.module';
import { RentersKeyboardsModule } from '../keyboards/renters-keyboards.module';
import { RentersTextsModule } from '../texts/renters-texts.module';
import { RentersApiModule } from '../api/renters-api.module';
import { RentersHandlersService } from './renters-handlers.service';

@Module({
  imports: [RentersModule, RentersKeyboardsModule, RentersTextsModule, RentersApiModule],
  providers: [RentersHandlersService],
  exports: [RentersHandlersService],
})
export class RentersHandlersModule {}
