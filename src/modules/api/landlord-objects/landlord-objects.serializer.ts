import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { LandlordObjectEntity } from './entities/LandlordObject.entity';
import { CreateLandlordObjectDto } from './dto/landlord-objects.dto';
import { ApiLandlordObjectFullResponseType } from './interfaces/landlord-objects.type';

interface LandlordObjectData {
  landlordObjectDto: CreateLandlordObjectDto;
  telegramUser: TelegramUserEntity;
}
@Injectable()
export class LandlordObjectsSerializer {
  // todo сделать потом в соответствии с данными нужными
  mapToDbData(landlordObjectData: LandlordObjectData): Partial<LandlordObjectEntity> {
    const { landlordObjectDto, telegramUser } = landlordObjectData;
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
}
