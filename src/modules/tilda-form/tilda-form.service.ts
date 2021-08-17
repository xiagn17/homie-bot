import { Injectable } from '@nestjs/common';
import { RenterRequest } from './tilda-form.dto';

@Injectable()
export class TildaFormService {
  async processRenter(data: RenterRequest): Promise<void> {
    // запушить в БД
    console.log(`new renter - `, data);
  }
}
