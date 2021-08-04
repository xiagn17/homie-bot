import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  warn(message: string): void {
    super.log(message);
    console.log(message);
  }

  error(message: string, trace?: string): void {
    super.error(message, trace);
    console.error(message, trace);
  }
}
