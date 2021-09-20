import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { Logger } from './modules/logger/logger.service';
import configuration from './modules/configuration/configuration';
import { DatabaseModule } from './modules/database/database.module';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { RentersModule } from './modules/renters/renters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    TelegramBotModule,
    RentersModule,
  ],
})
export class AppModule {}

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, { logger: new Logger() });
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '1mb' }));

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port);
  console.info('Server up and running...');
}

bootstrap().catch((e: Error) => console.error(e));
