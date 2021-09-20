import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { SendpulseService } from './sendpulse.service';
import { SendpulseStore } from './sendpulse.store';
import { SendpulseRequests } from './sendpulse.requests';

@Module({
  imports: [LoggerModule],
  providers: [SendpulseService, SendpulseStore, SendpulseRequests],
  exports: [SendpulseService],
})
export class SendpulseModule {}
