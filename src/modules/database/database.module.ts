import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

const API_MODULES_ENTITIES_DIR = join(__dirname, '..', 'api', '**', 'entities', '**');
const ALL_MODULES_ENTITIES_DIR = join(__dirname, '..', '**', 'entities', '**');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.db_username'),
        password: configService.get('database.db_password'),
        database: configService.get('database.db_database'),
        migrationsRun: configService.get('database.settings.migrationsRun'),
        synchronize: configService.get('database.settings.synchronize'),
        logging: configService.get('database.settings.logging'),
        migrations: [join(__dirname, '..', '..', 'migrations', '**')],
        entities: [API_MODULES_ENTITIES_DIR, ALL_MODULES_ENTITIES_DIR],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
