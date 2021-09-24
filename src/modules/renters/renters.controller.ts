import { Body, Controller, Post, Get, UsePipes, Param } from '@nestjs/common';
import { CreateRenterDTO } from './renters.dto';
import { RentersService } from './renters.service';
import { RentersPipe } from './renters.pipe';
import { RentersSerializer } from './renters.serializer';
import { ApiRenterExistsType, ApiRenterResponseType } from './renters.type';

@Controller('renters')
export class RentersController {
  constructor(private rentersService: RentersService, private rentersSerializer: RentersSerializer) {}

  @Get()
  async getRenters(): Promise<{ result: string }> {
    const renters = await this.rentersService.getRenters();
    return { result: renters.map(r => r.name).join(', ') };
  }

  @Get('/:chatId')
  async isRenterExists(@Param('chatId') chatId: string): Promise<ApiRenterExistsType> {
    const renter = await this.rentersService.getRenterByChatId(chatId);
    return this.rentersSerializer.toResponseRenterExists(renter);
  }

  @Post()
  @UsePipes(new RentersPipe())
  async createRenter(@Body() renter: CreateRenterDTO): Promise<ApiRenterResponseType> {
    const fullCreatedRenter = await this.rentersService.createRenter(renter);
    return this.rentersSerializer.toResponse(fullCreatedRenter);
  }
}
