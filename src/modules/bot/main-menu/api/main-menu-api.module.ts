import { Module } from '@nestjs/common';
import { LandlordObjectsModule } from '../../../api/landlord-objects/landlord-objects.module';
import { RentersModule } from '../../../api/renters/renters.module';
import { MainMenuApiService } from './main-menu-api.service';

@Module({
  imports: [LandlordObjectsModule, RentersModule],
  providers: [MainMenuApiService],
  exports: [MainMenuApiService],
})
export class MainMenuApiModule {}
