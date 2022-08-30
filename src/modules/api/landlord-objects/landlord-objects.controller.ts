import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LandlordObjectsService } from './landlord-objects.service';
import { ApiLandlordObjectDraft, ApiObjectResponse } from './interfaces/landlord-objects.type';

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
    @Body() landlordObjectDraft: ApiLandlordObjectDraft,
  ): Promise<void> {
    if (validate === 'kojih32uj4khu534k') {
      await this.landlordObjectsService.createObject(landlordObjectDraft);
      return;
    }
    return;
  }
}
