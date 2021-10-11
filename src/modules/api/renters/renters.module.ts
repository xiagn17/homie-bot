import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { RenterMatchesModule } from '../renter-matches/renter-matches.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './renters.serializer';
import { RentersController } from './renters.controller';

@Module({
  imports: [LoggerModule, RenterMatchesModule],
  controllers: [RentersController],
  providers: [RentersService, RentersSerializer],
  exports: [RentersService, RentersSerializer],
})
export class RentersModule {}
