import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Renter } from '../../entities/users/Renter';
import { LoggerModule } from '../logger/logger.module';
import { TildaFormController } from './tilda-form.controller';
import { TildaFormService } from './tilda-form.service';

@Module({
  imports: [TypeOrmModule.forFeature([Renter]), LoggerModule],
  controllers: [TildaFormController],
  providers: [TildaFormService],
})
export class TildaFormModule {}
