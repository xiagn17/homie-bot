import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LandlordObjectsService } from './landlord-objects.service';
import { ApiObjectResponse } from './interfaces/landlord-objects.type';
import { LandlordObjectCreate } from './dto/landlord-objects.dto';

@Controller('landlord-objects')
export class LandlordObjectsController {
  constructor(private landlordObjectsService: LandlordObjectsService) {}

  @Get()
  async getAllObjects(@Query('validate') validate: string): Promise<ApiObjectResponse[]> {
    if (validate === 'kojih32uj4khu534k') {
      return this.landlordObjectsService.getLatestObjects();
    }
    return [];
  }

  @Post()
  async createObject(
    @Query('validate') validate: string,
    @Body() landlordObjectDraft: LandlordObjectCreate,
  ): Promise<void> {
    if (validate === 'kojih32uj4khu534k') {
      await this.landlordObjectsService.createObject(landlordObjectDraft);
      return;
    }
    return;
  }
}
