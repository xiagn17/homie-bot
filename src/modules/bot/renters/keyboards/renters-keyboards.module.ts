import { Module } from '@nestjs/common';
import { RentersApiModule } from '../api/renters-api.module';
import { RentersKeyboardsService } from './renters-keyboards.service';

@Module({
  imports: [RentersApiModule],
  providers: [RentersKeyboardsService],
  exports: [RentersKeyboardsService],
})
export class RentersKeyboardsModule {}
