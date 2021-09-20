import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { SendpulseModule } from '../sendpulse/sendpulse.module';
import { RenterMatchesService } from './renter-matches.service';
import { RenterMatchesController } from './renter-matches.controller';

@Module({
  imports: [LoggerModule, SendpulseModule],
  controllers: [RenterMatchesController],
  providers: [RenterMatchesService],
  exports: [RenterMatchesService],
})
export class RenterMatchesModule {}
