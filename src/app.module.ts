import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { AppLogger } from './modules/logger/logger.service';
import { SheetsParserModule } from './modules/sheets-parser/sheets-parser.module';
import configuration from './modules/configuration/configuration';
import { TildaFormModule } from './modules/tilda-form/tilda-form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SheetsParserModule,
    TildaFormModule,
  ],
})
export class AppModule {}

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, { logger: new AppLogger() });
  // app.setGlobalPrefix("api");
  app.use(bodyParser.json({ limit: '1mb' }));

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port);
  console.info('Server up and running...');
}

bootstrap().catch((e: Error) => console.error(e));
