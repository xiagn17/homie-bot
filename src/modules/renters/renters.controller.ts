import { Body, Controller, Post, Get, UsePipes } from '@nestjs/common';
import { CreateRenterDTO } from './renters.dto';
import { RentersService } from './renters.service';
import { RentersPipe } from './renters.pipe';
import { RentersSerializer } from './renters.serializer';
import { RenterType } from './renters.type';

@Controller('renters')
export class RentersController {
  constructor(private rentersService: RentersService, private rentersSerializer: RentersSerializer) {}

  @Get()
  async getRenters(): Promise<{ result: string }> {
    const renters = await this.rentersService.getRenters();
    return { result: renters.map(r => r.name).join(', ') };
  }

  @Post()
  @UsePipes(new RentersPipe())
  async createRenter(@Body() renter: CreateRenterDTO): Promise<RenterType> {
    const fullCreatedRenter = await this.rentersService.createRenter(renter);
    return this.rentersSerializer.toResponse(fullCreatedRenter);
  }
}
