import { Module } from '@nestjs/common';
import { AdminKeyboardsService } from './admin-keyboards.service';

@Module({
  imports: [],
  providers: [AdminKeyboardsService],
  exports: [AdminKeyboardsService],
})
export class AdminKeyboardsModule {}
