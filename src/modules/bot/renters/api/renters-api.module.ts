import { Module } from '@nestjs/common';
import { RentersModule } from '../../../api/renters/renters.module';
import { RentersApiService } from './renters-api.service';

@Module({
  imports: [RentersModule],
  providers: [RentersApiService],
  exports: [RentersApiService],
})
export class RentersApiModule {}
