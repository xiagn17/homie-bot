import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { LandlordObjectEntity } from './entities/LandlordObject.entity';
import { CreateLandlordObjectDto } from './dto/landlord-objects.dto';
import {
  ApiLandlordObjectFullResponseType,
  ApiObjectPreviewInterface,
} from './interfaces/landlord-objects.type';

interface LandlordObjectData {
  landlordObjectDto: CreateLandlordObjectDto;
  telegramUser: TelegramUserEntity;
  isAdmin: boolean;
}
@Injectable()
export class LandlordObjectsSerializer {
  mapToDbData(landlordObjectData: LandlordObjectData): Partial<LandlordObjectEntity> {
    const { landlordObjectDto, telegramUser, isAdmin } = landlordObjectData;
    return {
      name: landlordObjectDto.name,
      address: landlordObjectDto.address,
      comment: landlordObjectDto.comment,
      phoneNumber: landlordObjectDto.phoneNumber,
      preferredGender: landlordObjectDto.preferredGender,
      price: landlordObjectDto.price,
      startArrivalDate: landlordObjectDto.startArrivalDate.toISOString(),
      telegramUserId: telegramUser.id,
      isApproved: false,
      isAdmin: isAdmin,
    };
  }

  toFullResponse(landlordObject: LandlordObjectEntity): ApiLandlordObjectFullResponseType {
    return {
      id: landlordObject.id,
      number: landlordObject.number,
      username: landlordObject.telegramUser.username ?? '',
      name: landlordObject.name,
      phoneNumber: landlordObject.phoneNumber,
      address: landlordObject.address,
      preferredGender: landlordObject.preferredGender,
      startArrivalDate: landlordObject.startArrivalDate,
      price: landlordObject.price,
      photoIds: JSON.stringify(landlordObject.photos.map(p => p.photoId)),
      comment: landlordObject.comment,
    };
  }

  toPreview(landlordObject: LandlordObjectEntity): ApiObjectPreviewInterface {
    return {
      id: landlordObject.id,
      address: landlordObject.address,
      apartmentsInfo: landlordObject.apartmentsInfo,
      comment: landlordObject.comment,
      details: landlordObject.details,
      isAdmin: landlordObject.isAdmin,
      number: landlordObject.number,
      objectType: landlordObject.objectType,
      photoIds: landlordObject.photos.map(p => p.photoId),
      price: landlordObject.price,
      roomBedInfo: landlordObject.roomBedInfo,
      roomsNumber: landlordObject.roomsNumber,
      startArrivalDate: new Date(landlordObject.startArrivalDate).toLocaleDateString().replaceAll('/', '.'),
    };
  }
}
