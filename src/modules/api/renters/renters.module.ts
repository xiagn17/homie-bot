import { forwardRef, Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { LandlordRenterMatchesModule } from '../landlord-renter-matches/landlord-renter-matches.module';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { RentersService } from './renters.service';
import { RentersSerializer } from './serializers/renters.serializer';
import { PaymentSucceededListener } from './listeners/payment-succeeded.listener';
import { RenterInfosSerializer } from './serializers/renter-infos.serializer';
import { RenterFiltersSerializer } from './serializers/renter-filters.serializer';

@Module({
  imports: [LoggerModule, AnalyticsModule, forwardRef(() => LandlordRenterMatchesModule), TelegramBotModule],
  controllers: [],
  providers: [
    RentersService,
    RentersSerializer,
    PaymentSucceededListener,
    RenterInfosSerializer,
    RenterFiltersSerializer,
  ],
  exports: [RentersService, RentersSerializer, RenterInfosSerializer],
})
export class RentersModule {}
