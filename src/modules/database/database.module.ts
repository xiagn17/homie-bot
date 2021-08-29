import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        entities: [join(__dirname, '..', '..', 'entities', '**')],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
