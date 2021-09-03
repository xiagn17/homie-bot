import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { MatchRentersService } from './match-renters.service';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [MatchRentersService],
  exports: [MatchRentersService],
})
export class MatchRentersModule {}
