import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { LandlordObjectsSerializer } from '../landlord-objects/landlord-objects.serializer';
import { ApiLandlordObjectFullResponseType } from '../landlord-objects/interfaces/landlord-objects.type';
import { ApiRenterResponseType } from '../renters/interfaces/renters.type';
import { RentersSerializer } from '../renters/serializers/renters.serializer';
import { ObjectMatchesForLandlordService } from './object-matches.for-landlord.service';
import { ChangeLandlordStatusOfObjectDto } from './dto/ChangeLandlordStatusOfObjectDto';
import { SetRenterLastInLandlordQueueDto } from './dto/SetRenterLastInLandlordQueue.dto';

@Controller('landlord-renter-matches')
export class LandlordRenterMatchesController {
  constructor(
    // private objectMatchesForRenterService: ObjectMatchesForRenterService,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
    private landlordObjectsSerializer: LandlordObjectsSerializer,
    private rentersSerializer: RentersSerializer,
  ) {}

  // @Get('/renter/:chatId')
  // async getNextObjectForRenter(
  //   @Param('chatId') chatId: string,
  // ): Promise<ApiLandlordObjectFullResponseType | null> {
  //   const nextLandlordObject = await this.objectMatchesForRenterService.getNextObject(chatId);
  //   if (!nextLandlordObject) {
  //     return null;
  //   }
  //   return this.landlordObjectsSerializer.toFullResponse(nextLandlordObject);
  // }

  // @Post('/renter/object-action')
  // async objectActionByRenter(@Body() renterStatusOfObjectDto: ChangeRenterStatusOfObjectDto): Promise<void> {
  //   await this.objectMatchesForRenterService.changeRenterStatusOfObject(renterStatusOfObjectDto);
  // }

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

  // @Get('/landlord/get-contacts/:renterId/:landlordObjectId')
  // getContacts(
  //   @Param('renterId') renterId: string,
  //   @Param('landlordObjectId') landlordObjectId: string,
  // ): Promise<string> {
  //   return this.objectMatchesForLandlordService.getPaidContacts(renterId, landlordObjectId);
  // }

  @Post('/landlord/renter-action')
  async renterActionByLandlord(
    @Body() landlordStatusOfObjectDto: ChangeLandlordStatusOfObjectDto,
  ): Promise<void> {
    await this.objectMatchesForLandlordService.changeLandlordStatusOfObject(landlordStatusOfObjectDto);
  }

  @Post('/landlord/postpone-renter')
  async setRenterLastInLandlordQueue(
    @Body() setRenterLastInLandlordQueueDto: SetRenterLastInLandlordQueueDto,
  ): Promise<void> {
    await this.objectMatchesForLandlordService.setRenterLastInLandlordQueue(setRenterLastInLandlordQueueDto);
  }
}
