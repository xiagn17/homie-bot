import { Module } from '@nestjs/common';
import { RentersService } from './renters.service';
import { RentersMenusModule } from './menus/renters-menus.module';

@Module({
  imports: [RentersMenusModule],
  providers: [RentersService],
  exports: [RentersService],
})
export class RentersModule {}
