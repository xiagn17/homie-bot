import { Body, Controller, Post, Get, UsePipes, Param } from '@nestjs/common';
import { CreateRenterDTO } from './renters.dto';
import { RentersService } from './renters.service';
import { RentersPipe } from './renters.pipe';
import { RentersSerializer } from './renters.serializer';
import { ApiRenterFullType, ApiRenterResponseType } from './renters.type';

@Controller('renters')
export class RentersController {
  constructor(private rentersService: RentersService, private rentersSerializer: RentersSerializer) {}

  @Get('/:chatId')
  async getRenterWithMatches(@Param('chatId') chatId: string): Promise<ApiRenterFullType> {
    const fullRenter = await this.rentersService.getRenterByChatId(chatId);
    return this.rentersSerializer.toResponseRenterExists(fullRenter);
  }

  @Post()
  @UsePipes(new RentersPipe())
  async createRenter(@Body() renter: CreateRenterDTO): Promise<ApiRenterResponseType> {
    const fullCreatedRenter = await this.rentersService.createRenter(renter);
    return this.rentersSerializer.toResponse(fullCreatedRenter);
  }
}
