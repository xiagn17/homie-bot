import { Body, Controller, Post } from '@nestjs/common';
import { TelegramChatIdDTO } from '../telegram-bot/dto/telegram-bot.dto';
import { AnalyticsService } from '../analytics/analytics.service';
import { BusinessAnalyticsFieldsEnumType } from '../analytics/interfaces/analytics.type';
import { RenterMatchesService } from './renter-matches.service';
import {
  ApiAddPaidMatchesResponse,
  ApiRenterStartMatchesResponse,
  RenterStartMatchesStatus,
} from './interfaces/renter-matches.type';
import { RenterMatchesChangeStatusDTO, RenterMatchesPaidDTO } from './dto/renter-matches.dto';

@Controller('renter-matches')
export class RenterMatchesController {
  constructor(
    private renterMatchesService: RenterMatchesService,
    private analyticsService: AnalyticsService,
  ) {}

  @Post('/create')
  async startMatchingRenter(@Body() { chatId }: TelegramChatIdDTO): Promise<ApiRenterStartMatchesResponse> {
    return await this.renterMatchesService.startMatchingRenter(chatId);
  }

  @Post('/change-status')
  async changeMatchStatus(@Body() data: RenterMatchesChangeStatusDTO): Promise<any> {
    await this.renterMatchesService.changeMatchStatus(data);
  }

  @Post('/add-paid-matches')
  async addPaidMatches(@Body() data: RenterMatchesPaidDTO): Promise<ApiAddPaidMatchesResponse> {
    const matchesInfo = await this.renterMatchesService.addPaidMatches(data.chatId);
    await this.analyticsService.changeStatus({
      chatId: data.chatId,
      field: BusinessAnalyticsFieldsEnumType.pay_match,
    });
    return {
      status: RenterStartMatchesStatus.ok,
      ableMatches: matchesInfo.ableMatches,
    };
  }

  @Post('/stop-matching')
  async stopMatching(@Body() { chatId }: TelegramChatIdDTO): Promise<void> {
    await this.renterMatchesService.stopMatchingRenter(chatId);
  }
}
