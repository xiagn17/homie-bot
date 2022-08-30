import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { LandlordObjectEntity } from './entities/LandlordObject.entity';
import { ApiLandlordObjectDraft, ApiObjectResponse } from './interfaces/landlord-objects.type';
import { getObjectActiveTimestamp } from './constants/landlord-object-active-time.constant';

interface LandlordObjectData {
  landlordObjectDraft: ApiLandlordObjectDraft;
  telegramUser: TelegramUserEntity;
  isAdmin: boolean;
}
@Injectable()
export class LandlordObjectsSerializer {
  mapToDbData(landlordObjectData: LandlordObjectData): Partial<LandlordObjectEntity> {
    const { landlordObjectDraft, telegramUser, isAdmin } = landlordObjectData;
    return {
      name: landlordObjectDraft.name,
      phoneNumber: landlordObjectDraft.phoneNumber,
      location: landlordObjectDraft.location,
      address: landlordObjectDraft.address,
      preferredGender: landlordObjectDraft.preferredGender,
      price: landlordObjectDraft.price,
      comment: landlordObjectDraft.comment,
      objectType: landlordObjectDraft.objectType,
      roomsNumber: landlordObjectDraft.roomsNumber,

      isApproved: false,
      telegramUserId: telegramUser.id,
      isAdmin: isAdmin,
    };
  }

  toResponse(landlordObject: LandlordObjectEntity): ApiObjectResponse {
    const isObjectActive =
      !landlordObject.stoppedAt &&
      !!landlordObject.updatedAt &&
      new Date().getTime() - getObjectActiveTimestamp(landlordObject.objectType) <
        new Date(landlordObject.updatedAt).getTime();
    return {
      id: landlordObject.id,
      isAdmin: landlordObject.isAdmin,
      number: landlordObject.number,
      isApproved: landlordObject.isApproved,
      isActive: isObjectActive,
      objectType: landlordObject.objectType,

      roomsNumber: landlordObject.roomsNumber,
      address: landlordObject.address,
      price: landlordObject.price,
      photoIds: landlordObject.photos.map(p => p.photoId),
      comment: landlordObject.comment,
    };
  }
}
