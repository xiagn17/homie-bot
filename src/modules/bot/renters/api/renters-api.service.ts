import { Injectable } from '@nestjs/common';
import { RentersService } from '../../../api/renters/renters.service';

@Injectable()
export class RentersApiService {
  constructor(private readonly rentersService: RentersService) {}

  create(): void {
    console.log(this.rentersService);
  }
}
