import { Body, Controller, Post } from '@nestjs/common';
import { TelegramChatIdDTO } from '../telegram-bot/telegram-bot.dto';
import { RenterMatchesService } from './renter-matches.service';
import { ApiAddPaidMatchesResponse, ApiRenterStartMatchesResponse } from './renter-matches.type';
import { RenterMatchesChangeStatusDTO } from './renter-matches.dto';

@Controller('renter-matches')
export class RenterMatchesController {
  constructor(private renterMatchesService: RenterMatchesService) {}

  @Post('/create')
  async startMatchingRenter(@Body() { chatId }: TelegramChatIdDTO): Promise<ApiRenterStartMatchesResponse> {
    return await this.renterMatchesService.startMatchingRenter(chatId);
  }

  @Post('/change-status')
  async changeMatchStatus(@Body() data: RenterMatchesChangeStatusDTO): Promise<any> {
    await this.renterMatchesService.changeMatchStatus(data);
  }

  @Post('/add-paid-matches')
  async addPaidMatches(@Body() { chatId }: TelegramChatIdDTO): Promise<ApiAddPaidMatchesResponse> {
    const matchesInfo = await this.renterMatchesService.addPaidMatches(chatId);
    return {
      success: true,
      ableMatches: matchesInfo.ableMatches,
    };
  }
}
