import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from '../../../logger/logger.module';
import { QUEUE_APPROVE_ADMIN_OBJECT_NAME } from '../queue-approve-admin-object.constants';
import { QueueApproveAdminObjectProducerService } from './queue-approve-admin-object.producer.service';

@Module({
  imports: [LoggerModule, BullModule.registerQueue({ name: QUEUE_APPROVE_ADMIN_OBJECT_NAME })],
  providers: [QueueApproveAdminObjectProducerService],
  exports: [QueueApproveAdminObjectProducerService],
})
export class QueueApproveAdminObjectProducerModule {}
