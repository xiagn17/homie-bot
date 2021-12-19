import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { FlowXoService } from './flow-xo.service';
import { FlowXoRequests } from './flow-xo.requests';
import { FlowXoSerializer } from './flow-xo.serializer';

@Module({
  imports: [LoggerModule],
  providers: [FlowXoService, FlowXoRequests, FlowXoSerializer],
  exports: [FlowXoService],
})
export class FlowXoModule {}
