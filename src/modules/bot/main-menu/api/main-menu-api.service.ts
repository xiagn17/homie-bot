import { Injectable } from '@nestjs/common';
import { LandlordObjectsService } from '../../../api/landlord-objects/landlord-objects.service';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { ApiRenterFull } from '../../../api/renters/interfaces/renters.type';
import { RentersService } from '../../../api/renters/renters.service';

@Injectable()
export class MainMenuApiService {
  constructor(
    private readonly landlordObjectsService: LandlordObjectsService,
    private readonly rentersService: RentersService,
  ) {}

  getUserObject(chatId: string): Promise<ApiObjectResponse | null> {
    return this.landlordObjectsService.getObjectByChatId(chatId);
  }

  async getRenterEntityOfUser(chatId: string): Promise<ApiRenterFull> {
    const renter = await this.rentersService.getRenterByChatId(chatId);
    return renter;
  }
}
