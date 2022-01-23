import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as requestIp from 'request-ip';
import ipRangeCheck from 'ip-range-check';
import { LoggerService } from '../../../logger/logger.service';

// youkassa ips
const ALLOWED_CIRD_IPS: string[] = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.156.11',
  '77.75.156.35',
  '77.75.154.128/25',
  '2a02:5180:0:1509::/64',
  '2a02:5180:0:2655::/64',
  '2a02:5180:0:1533::/64',
  '2a02:5180:0:2669::/64',
];

@Injectable()
export class PaymentsWebhookGuard implements CanActivate {
  constructor(private logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);
    if (!ip) {
      this.logger.error('[Guard] No ip address, blocking request');
      return false;
    }
    const isIpValid = ipRangeCheck(ip, ALLOWED_CIRD_IPS);
    if (!isIpValid) {
      this.logger.warn('[Guard] Wrong Ip address, blocking request');
    }
    return isIpValid;
  }
}
