import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './renters.serializer';
import { RentersController } from './renters.controller';

@Module({
  imports: [LoggerModule],
  controllers: [RentersController],
  providers: [RentersService, RentersSerializer],
  exports: [RentersSerializer],
})
export class RentersModule {}
