import { Module } from '@nestjs/common';
import { LandlordObjectsModule } from '../../../api/landlord-objects/landlord-objects.module';
import { MainMenuApiService } from './main-menu-api.service';

@Module({
  imports: [LandlordObjectsModule],
  providers: [MainMenuApiService],
  exports: [MainMenuApiService],
})
export class MainMenuApiModule {}
