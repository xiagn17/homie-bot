import { Controller, Get } from '@nestjs/common';
import { SheetsParserService } from './sheets-parser.service';

@Controller()
export class SheetsParserController {
  constructor(private sheetsParserService: SheetsParserService) {}

  @Get()
  async defaultRoute(): Promise<void> {
    await this.sheetsParserService.parseSheet();
  }
}
