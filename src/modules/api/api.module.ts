import { Module } from '@nestjs/common';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { RentersModule } from './renters/renters.module';
import { RenterMatchesModule } from './renter-matches/renter-matches.module';
import { LandlordObjectsModule } from './landlord-objects/landlord-objects.module';
import { LandlordRenterMatchesModule } from './landlord-renter-matches/landlord-renter-matches.module';

@Module({
  imports: [
    TelegramBotModule,
    RentersModule,
    RenterMatchesModule,
    LandlordObjectsModule,
    LandlordRenterMatchesModule,
  ],
  exports: [
    TelegramBotModule,
    RentersModule,
    RenterMatchesModule,
    LandlordObjectsModule,
    LandlordRenterMatchesModule,
  ],
})
export class ApiModule {}
