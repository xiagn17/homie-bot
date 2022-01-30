import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';

@Module({
  imports: [],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
