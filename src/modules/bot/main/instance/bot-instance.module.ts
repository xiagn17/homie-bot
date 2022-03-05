import { Module } from '@nestjs/common';
import { BotInstanceService } from './bot-instance.service';

@Module({
  imports: [],
  providers: [BotInstanceService],
  exports: [BotInstanceService],
})
export class BotInstanceModule {}
