import { Module } from '@nestjs/common';
import { RentersObjectsKeyboardsService } from './renters-objects-keyboards.service';

@Module({
  imports: [],
  providers: [RentersObjectsKeyboardsService],
  exports: [RentersObjectsKeyboardsService],
})
export class RentersObjectsKeyboardsModule {}
