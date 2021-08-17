import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RenterTransformToDTO implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata): any {
    value.requestId = value.tranid;
    value.utmSource = value.utm_source;
    value.sentTime = new Date();
    delete value.tranid;
    delete value.utm_source;
    return value;
  }
}
