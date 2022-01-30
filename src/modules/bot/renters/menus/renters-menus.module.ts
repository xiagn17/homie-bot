import { Module } from '@nestjs/common';
import { RentersMenusService } from './renters-menus.service';

@Module({
  imports: [],
  providers: [RentersMenusService],
  exports: [RentersMenusService],
})
export class RentersMenusModule {}
