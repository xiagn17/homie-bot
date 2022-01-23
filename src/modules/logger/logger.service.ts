import { Inject, Injectable, Scope } from '@nestjs/common';
import { Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params);
  }

  warn(message: string, ...args: any[]): void {
    super.warn(message, ...args);
  }

  info(message: string, ...other: any[]): void {
    super.info(message, ...other);
  }

  error(message: string, ...args: any[]): void {
    super.error(message, ...args);
  }
}
