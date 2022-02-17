import { Module } from '@nestjs/common';
import { RentersTextsService } from './renters-texts.service';

@Module({
  imports: [],
  providers: [RentersTextsService],
  exports: [RentersTextsService],
})
export class RentersTextsModule {}
