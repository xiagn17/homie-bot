import { Module } from '@nestjs/common';
import { AdminTextsService } from './admin-texts.service';

@Module({
  imports: [],
  providers: [AdminTextsService],
  exports: [AdminTextsService],
})
export class AdminTextsModule {}
