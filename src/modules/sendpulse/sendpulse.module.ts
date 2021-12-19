import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { SendpulseService } from './sendpulse.service';
import { SendpulseStore } from './sendpulse.store';
import { SendpulseRequests } from './sendpulse.requests';
import { SendpulseSerializer } from './sendpulse.serializer';

// @deprecated - moved to FlowXo
@Module({
  imports: [LoggerModule],
  providers: [SendpulseService, SendpulseStore, SendpulseRequests, SendpulseSerializer],
  exports: [SendpulseService],
})
export class SendpulseModule {}
