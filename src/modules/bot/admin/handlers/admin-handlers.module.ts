import { Module } from '@nestjs/common';
import { AdminApiModule } from '../api/admin-api.module';
import { AdminKeyboardsModule } from '../keyboards/admin-keyboards.module';
import { AdminHandlersService } from './admin-handlers.service';

@Module({
  imports: [AdminApiModule, AdminKeyboardsModule],
  providers: [AdminHandlersService],
  exports: [AdminHandlersService],
})
export class AdminHandlersModule {}
