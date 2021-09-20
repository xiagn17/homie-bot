import { Controller, Get, Query } from '@nestjs/common';
import { RenterMatchesService } from './renter-matches.service';

@Controller('renter-matches')
export class RenterMatchesController {
  constructor(private renterMatchesService: RenterMatchesService) {}

  @Get('/match')
  async getMatchForRenter(@Query('chatId') userChatId: string): Promise<any> {
    await this.renterMatchesService.getMatchForRenter(userChatId);
  }
}
