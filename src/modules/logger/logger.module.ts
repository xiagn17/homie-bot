import { Module } from '@nestjs/common';
import { LoggerModule as LoggerModulePino } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    LoggerModulePino.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          pinoHttp: {
            name: 'Homie_API',
            level: config.get('env') !== 'production' ? 'debug' : 'info',
            transport:
              config.get('env') !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      levelFirst: true,
                      singleLine: true,
                    },
                  }
                : undefined,
          },
        };
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
