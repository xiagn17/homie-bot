import { Module } from '@nestjs/common';
import { LandlordsTextsModule } from '../texts/landlords-texts.module';
import { LandlordsModule } from '../landlords.module';
import { LandlordsKeyboardsModule } from '../keyboards/landlords-keyboards.module';
import { MainMenuModule } from '../../main-menu/main-menu.module';
import { LandlordsApiModule } from '../api/landlords-api.module';
import { LandlordsHandlersService } from './landlords-handlers.service';

@Module({
  imports: [
    LandlordsTextsModule,
    LandlordsModule,
    LandlordsKeyboardsModule,
    MainMenuModule,
    LandlordsApiModule,
  ],
  providers: [LandlordsHandlersService],
  exports: [LandlordsHandlersService],
})
export class LandlordsHandlersModule {}
