import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { Logger as LoggerPinoService } from 'nestjs-pino';
import configuration from './modules/configuration/configuration';
import { DatabaseModule } from './modules/database/database.module';
import { TelegramBotModule } from './modules/api/telegram-bot/telegram-bot.module';
import { RentersModule } from './modules/api/renters/renters.module';
import { RenterMatchesModule } from './modules/api/renter-matches/renter-matches.module';
import { LandlordObjectsModule } from './modules/api/landlord-objects/landlord-objects.module';
import { LandlordRenterMatchesModule } from './modules/api/landlord-renter-matches/landlord-renter-matches.module';
import { RedisQueuesConnectionModule } from './modules/queues/redis-queues.connection.module';
import { QueuesConsumersModule } from './modules/queues/queues.consumers.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule,
    DatabaseModule,
    RedisQueuesConnectionModule,
    QueuesConsumersModule,
    TelegramBotModule,
    RentersModule,
    RenterMatchesModule,
    LandlordObjectsModule,
    LandlordRenterMatchesModule,
  ],
})
export class AppModule {}

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '1mb' }));
  app.useLogger(app.get(LoggerPinoService));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port);

  console.info('Server up and running...');
}

bootstrap().catch((e: Error) => console.error(e));
