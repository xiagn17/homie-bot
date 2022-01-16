import { Module } from '@nestjs/common';
import { SessionStorageService } from './session-storage.service';

@Module({
  imports: [],
  providers: [SessionStorageService],
  exports: [SessionStorageService],
})
export class SessionStorageModule {}
