import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { TildaFormService } from './tilda-form.service';
import { RenterRequestDTO } from './tilda-form.dto';
import { RenterTransformToDTO } from './tilda-form.pipe';

@Controller('tilda-form')
export class TildaFormController {
  constructor(private tildaFormWebhookService: TildaFormService) {}

  @Post('/accept-renter')
  @UsePipes(new RenterTransformToDTO())
  async processRenter(@Body() data: RenterRequestDTO): Promise<void> {
    await this.tildaFormWebhookService.processRenter(data);
  }
}
