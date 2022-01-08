import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { LandlordObjectsSerializer } from '../landlord-objects/landlord-objects.serializer';
import { ApiLandlordObjectFullResponseType } from '../landlord-objects/landlord-objects.type';
import { ApiRenterResponseType } from '../renters/renters.type';
import { RentersSerializer } from '../renters/renters.serializer';
import { ObjectMatchesForRenterService } from './object-matches.for-renter.service';
import { ChangeRenterStatusOfObjectDto } from './dto/ChangeRenterStatusOfObjectDto';
import { ObjectMatchesForLandlordService } from './object-matches.for-landlord.service';
import { ChangeLandlordStatusOfObjectDto } from './dto/ChangeLandlordStatusOfObjectDto';

@Controller('landlord-renter-matches')
export class LandlordRenterMatchesController {
  constructor(
    private objectMatchesForRenterService: ObjectMatchesForRenterService,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
    private landlordObjectsSerializer: LandlordObjectsSerializer,
    private rentersSerializer: RentersSerializer,
  ) {}

  @Get('/renter/:chatId')
  async getNextObjectForRenter(
    @Param('chatId') chatId: string,
  ): Promise<ApiLandlordObjectFullResponseType | null> {
    const nextLandlordObject = await this.objectMatchesForRenterService.getNextObject(chatId);
    if (!nextLandlordObject) {
      return null;
    }
    return this.landlordObjectsSerializer.toFullResponse(nextLandlordObject);
  }

  @Post('/renter/object-action')
  async objectActionByRenter(@Body() renterStatusOfObjectDto: ChangeRenterStatusOfObjectDto): Promise<void> {
    await this.objectMatchesForRenterService.changeRenterStatusOfObject(renterStatusOfObjectDto);
  }

  @Get('/landlord/:landlordObjectId')
  async getNextRenterForLandlord(
    @Param('landlordObjectId') landlordObjectId: string,
  ): Promise<ApiRenterResponseType | null> {
    const nextRenter = await this.objectMatchesForLandlordService.getNextRenter(landlordObjectId);
    if (!nextRenter) {
      return null;
    }
    return this.rentersSerializer.toResponse(nextRenter);
  }

  @Get('/landlord/with-unresolved-matches/:chatId')
  async getObjectWithUnresolvedMatches(
    @Param('chatId') chatId: string,
  ): Promise<ApiLandlordObjectFullResponseType | null> {
    const landlordObject = await this.objectMatchesForLandlordService.getObjectWithUnresolvedRenterMatches(
      chatId,
    );
    return landlordObject && this.landlordObjectsSerializer.toFullResponse(landlordObject);
  }

  @Post('/landlord/renter-action')
  async renterActionByLandlord(
    @Body() landlordStatusOfObjectDto: ChangeLandlordStatusOfObjectDto,
  ): Promise<void> {
    await this.objectMatchesForLandlordService.changeLandlordStatusOfObject(landlordStatusOfObjectDto);
  }
}
