import { Module } from '@nestjs/common';
import { RenterObjectsTextsService } from './renter-objects-texts.service';

@Module({
  imports: [],
  providers: [RenterObjectsTextsService],
  exports: [RenterObjectsTextsService],
})
export class RenterObjectsTextsModule {}
