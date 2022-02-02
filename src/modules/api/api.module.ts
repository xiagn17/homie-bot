import { Module } from '@nestjs/common';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { RentersModule } from './renters/renters.module';
import { LandlordObjectsModule } from './landlord-objects/landlord-objects.module';
import { LandlordRenterMatchesModule } from './landlord-renter-matches/landlord-renter-matches.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TelegramBotModule,
    RentersModule,
    LandlordObjectsModule,
    LandlordRenterMatchesModule,
    PaymentsModule,
    AdminModule,
  ],
  exports: [
    TelegramBotModule,
    RentersModule,
    LandlordObjectsModule,
    LandlordRenterMatchesModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class ApiModule {}
