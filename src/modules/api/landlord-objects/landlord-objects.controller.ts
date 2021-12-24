import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateLandlordObjectDto } from './landlord-objects.dto';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsPipe } from './landlord-objects.pipe';

@Controller('landlord-objects')
export class LandlordObjectsController {
  constructor(private landlordObjectsService: LandlordObjectsService) {}

  // @Get('/:chatId')
  // async getRenterWithMatches(@Param('chatId') chatId: string): Promise<ApiRenterFullType> {
  //   const fullRenter = await this.rentersService.getRenterByChatId(chatId);
  //   return this.rentersSerializer.toResponseRenterExists(fullRenter);
  // }

  @Post()
  @UsePipes(new LandlordObjectsPipe())
  // todo ApiLandlordObjectResponseType
  async createObject(@Body() landlordObjectDto: CreateLandlordObjectDto): Promise<any> {
    const landlordObjectEntity = await this.landlordObjectsService.createObject(landlordObjectDto);
    console.log(landlordObjectEntity);
    return landlordObjectEntity;
    // return this.landlordObjectsSerializer.toResponse(landlordObjectEntity);
  }
}
