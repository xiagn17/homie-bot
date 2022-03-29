import { Module } from '@nestjs/common';
import { AdminTextsModule } from '../admin/texts/admin-texts.module';
import { AdminKeyboardsModule } from '../admin/keyboards/admin-keyboards.module';
import { BotInstanceModule } from '../main/instance/bot-instance.module';
import { LandlordsTextsModule } from '../landlords/texts/landlords-texts.module';
import { LandlordRentersKeyboardsModule } from '../landlord-renters/keyboards/landlord-renters-keyboards.module';
import { RentersTextsModule } from '../renters/texts/renters-texts.module';
import { RenterObjectsTextsModule } from '../renter-objects/texts/renter-objects-texts.module';
import { RentersObjectsKeyboardsModule } from '../renter-objects/keyboards/renters-objects-keyboards.module';
import { LandlordsKeyboardsModule } from '../landlords/keyboards/landlords-keyboards.module';
import { RenterObjectsApiModule } from '../renter-objects/api/renter-objects-api.module';
import { RentersApiModule } from '../renters/api/renters-api.module';
import { BroadcastService } from './broadcast.service';
import { BroadcastEventsListener } from './listeners/broadcast-events.listener';

@Module({
  imports: [
    BotInstanceModule,
    AdminTextsModule,
    AdminKeyboardsModule,
    LandlordsTextsModule,
    LandlordsKeyboardsModule,
    RentersTextsModule,
    RentersApiModule,
    LandlordRentersKeyboardsModule,
    RenterObjectsTextsModule,
    RentersObjectsKeyboardsModule,
    RenterObjectsApiModule,
  ],
  providers: [BroadcastService, BroadcastEventsListener],
  exports: [],
})
export class BroadcastModule {}
