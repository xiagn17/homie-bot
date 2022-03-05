import { Injectable } from '@nestjs/common';
import { LandlordObjectsService } from '../../../api/landlord-objects/landlord-objects.service';
import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';
import {
  ApiLandlordObjectDraft,
  ApiObjectResponse,
} from '../../../api/landlord-objects/interfaces/landlord-objects.type';

@Injectable()
export class LandlordsApiService {
  constructor(private readonly landlordObjectsService: LandlordObjectsService) {}

  createObject(data: ApiLandlordObjectDraft): Promise<LandlordObjectEntity> {
    return this.landlordObjectsService.createObject(data);
  }

  getObject(chatId: string): Promise<ApiObjectResponse | null> {
    return this.landlordObjectsService.getObjectByChatId(chatId);
  }

  stopSearchObject(chatId: string): Promise<void> {
    return this.landlordObjectsService.archiveObject({ chatId });
  }

  renewObject(chatId: string): Promise<string> {
    return this.landlordObjectsService.renewObject({
      chatId: chatId,
    });
  }
}
