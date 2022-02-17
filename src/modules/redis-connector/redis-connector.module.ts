import { Module } from '@nestjs/common';
import { RedisConnectorService } from './redis-connector.service';

@Module({
  imports: [],
  providers: [RedisConnectorService],
  exports: [RedisConnectorService],
})
export class RedisConnectorModule {}
