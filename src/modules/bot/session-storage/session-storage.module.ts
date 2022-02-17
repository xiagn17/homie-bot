import { Module } from '@nestjs/common';
import { RedisConnectorModule } from '../../redis-connector/redis-connector.module';
import { SessionStorageService } from './session-storage.service';

@Module({
  imports: [RedisConnectorModule],
  providers: [SessionStorageService],
  exports: [SessionStorageService],
})
export class SessionStorageModule {}
