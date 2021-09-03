import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { MatchRentersModule } from '../match-renter/match-renters.module';
import { TildaFormController } from './tilda-form.controller';
import { TildaFormService } from './tilda-form.service';
import { TildaFormSerializer } from './tilda-form.serializer';

@Module({
  imports: [LoggerModule, MatchRentersModule],
  controllers: [TildaFormController],
  providers: [TildaFormService, TildaFormSerializer],
})
export class TildaFormModule {}
