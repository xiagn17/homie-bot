import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { SendpulseModule } from '../sendpulse/sendpulse.module';
import { RentersModule } from '../renters/renters.module';
import { RenterMatchesService } from './renter-matches.service';
import { RenterMatchesController } from './renter-matches.controller';
import { RenterMatchesSerializer } from './renter-matches.serializer';

@Module({
  imports: [LoggerModule, SendpulseModule, RentersModule],
  controllers: [RenterMatchesController],
  providers: [RenterMatchesService, RenterMatchesSerializer],
  exports: [RenterMatchesService],
})
export class RenterMatchesModule {}
