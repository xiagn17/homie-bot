import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  warn(message: string): void {
    super.log(message);
    // eslint-disable-next-line no-console
    console.log(message);
  }

  error(message: string, trace?: string): void {
    super.error(message, trace);
    console.error(message, trace);
  }
}
