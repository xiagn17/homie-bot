import { Module } from '@nestjs/common';
import { AdminApiModule } from '../api/admin-api.module';
import { AdminHandlersService } from './admin-handlers.service';

@Module({
  imports: [AdminApiModule],
  providers: [AdminHandlersService],
  exports: [AdminHandlersService],
})
export class AdminHandlersModule {}
