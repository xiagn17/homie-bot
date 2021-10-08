import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  warn(message: string): void {
    super.warn(message);
  }

  log(message: string, ...other: any[]): void {
    super.log(message, ...other);
  }

  error(message: string): void {
    super.error(message);
  }
}
