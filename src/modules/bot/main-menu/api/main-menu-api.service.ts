import { Injectable } from '@nestjs/common';
import { LandlordObjectsService } from '../../../api/landlord-objects/landlord-objects.service';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

@Injectable()
export class MainMenuApiService {
  constructor(private readonly landlordObjectsService: LandlordObjectsService) {}

  getUserObject(chatId: string): Promise<ApiObjectResponse | null> {
    return this.landlordObjectsService.getObjectByChatId(chatId);
  }
}
