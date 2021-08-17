import { Module } from '@nestjs/common';
import { TildaFormController } from './tilda-form.controller';
import { TildaFormService } from './tilda-form.service';

@Module({
  imports: [],
  controllers: [TildaFormController],
  providers: [TildaFormService],
})
export class TildaFormModule {}
