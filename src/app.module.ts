import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { Logger as LoggerPinoService } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from './modules/configuration/configuration';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/logger/logger.module';
import { TasksWorkerModule } from './modules/tasks/worker/tasks.worker.module';
import { ApiModule } from './modules/api/api.module';
import { BotModule } from './modules/bot/main/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    LoggerModule,
    DatabaseModule,
    TasksWorkerModule,
    ApiModule,
    BotModule,
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
