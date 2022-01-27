import { Module } from '@nestjs/common';
import { LandlordObjectsModule } from '../landlord-objects/landlord-objects.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [LandlordObjectsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [],
})
export class AdminModule {}
