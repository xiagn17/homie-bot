import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CreateRenterDTO } from './dto/renters.dto';
import { RentersService } from './renters.service';
import { RentersSerializer } from './renters.serializer';
import { ApiRenterFullType, ApiRenterResponseType } from './interfaces/renters.type';

@Controller('renters')
export class RentersController {
  constructor(private rentersService: RentersService, private rentersSerializer: RentersSerializer) {}

  @Get('/is-renter/:chatId')
  async isUserRenter(@Param('chatId') chatId: string): Promise<boolean> {
    return this.rentersService.isUserRenter(chatId);
  }

  @Get('/:chatId')
  async getRenterWithMatches(@Param('chatId') chatId: string): Promise<ApiRenterFullType> {
    const fullRenter = await this.rentersService.getRenterByChatId(chatId);
    return this.rentersSerializer.toResponseRenterExists(fullRenter);
  }

  @Post()
  async createRenter(@Body() renter: CreateRenterDTO): Promise<ApiRenterResponseType | any> {
    const fullCreatedRenter = await this.rentersService.createRenter(renter);
    return this.rentersSerializer.toResponse(fullCreatedRenter);
  }
}
