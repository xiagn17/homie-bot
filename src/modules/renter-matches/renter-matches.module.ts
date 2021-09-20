import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RenterMatchesService } from './renter-matches.service';
import { RenterMatchesController } from './renter-matches.controller';

@Module({
  imports: [LoggerModule],
  controllers: [RenterMatchesController],
  providers: [RenterMatchesService],
  exports: [RenterMatchesService],
})
export class RenterMatchesModule {}
