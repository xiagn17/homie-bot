import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { ObjectTypeEnum } from '../renters/entities/RenterFilters.entity';
import { LandlordObjectEntity } from './entities/LandlordObject.entity';
import { ApiLandlordObjectDraft, ApiObjectResponse } from './interfaces/landlord-objects.type';
import { LandlordObjectRoomBedInfoInterface } from './interfaces/landlord-object-room-bed-info.interface';
import { LandlordObjectApartmentsInfoInterface } from './interfaces/landlord-object-apartments-info.interface';
import { OBJECT_ACTIVE_TIME_TIMESTAMP } from './constants/landlord-object-active-time.constant';

interface LandlordObjectData {
  landlordObjectDraft: ApiLandlordObjectDraft;
  telegramUser: TelegramUserEntity;
  isAdmin: boolean;
}
@Injectable()
export class LandlordObjectsSerializer {
  mapToDbData(landlordObjectData: LandlordObjectData): Partial<LandlordObjectEntity> {
    const { landlordObjectDraft, telegramUser, isAdmin } = landlordObjectData;
    const base = {
      name: landlordObjectDraft.name,
      phoneNumber: landlordObjectDraft.phoneNumber,
      location: landlordObjectDraft.location,
      address: landlordObjectDraft.address,
      preferredGender: landlordObjectDraft.preferredGender,
      startArrivalDate: landlordObjectDraft.startArrivalDate.toISOString(),
      price: landlordObjectDraft.price,
      comment: landlordObjectDraft.comment,
      objectType: landlordObjectDraft.objectType,
      roomsNumber: landlordObjectDraft.roomsNumber,
      details: landlordObjectDraft.details,

      placeOnSites: landlordObjectDraft.placeOnSites,
      isApproved: false,
      telegramUserId: telegramUser.id,
      isAdmin: isAdmin,
    };

    if (landlordObjectDraft.objectType === ObjectTypeEnum.apartments) {
      return {
        ...base,
        apartmentsInfo: landlordObjectDraft.apartmentsInfo,
        roomBedInfo: null,
      };
    }
    return {
      ...base,
      roomBedInfo: landlordObjectDraft.roomBedInfo,
      apartmentsInfo: null,
    };
  }

  toResponse(landlordObject: LandlordObjectEntity): ApiObjectResponse {
    const isObjectActive =
      !landlordObject.stoppedAt &&
      !!landlordObject.updatedAt &&
      new Date().getTime() - OBJECT_ACTIVE_TIME_TIMESTAMP < new Date(landlordObject.updatedAt).getTime();
    const base = {
      id: landlordObject.id,
      isAdmin: landlordObject.isAdmin,
      number: landlordObject.number,
      isApproved: landlordObject.isApproved,
      isActive: isObjectActive,
      placeOnSites: landlordObject.placeOnSites,

      roomsNumber: landlordObject.roomsNumber,
      details: landlordObject.details,
      address: landlordObject.address,
      price: landlordObject.price,
      photoIds: landlordObject.photos.map(p => p.photoId),
      startArrivalDate: new Date(landlordObject.startArrivalDate).toLocaleDateString('ru-RU'),
      comment: landlordObject.comment,
    };
    if (landlordObject.objectType === ObjectTypeEnum.apartments) {
      return {
        ...base,
        objectType: landlordObject.objectType,
        apartmentsInfo: landlordObject.apartmentsInfo as LandlordObjectApartmentsInfoInterface,
      };
    }

    return {
      ...base,
      objectType: landlordObject.objectType,
      roomBedInfo: landlordObject.roomBedInfo as LandlordObjectRoomBedInfoInterface,
    };
  }
}
