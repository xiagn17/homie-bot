import { Injectable } from '@nestjs/common';
import { LocationEntity } from '../../../entities/directories/Location.entity';
import { TelegramUserEntity } from '../../../entities/users/TelegramUser.entity';
import { LandlordObjectEntity } from '../../../entities/landlord-objects/LandlordObject.entity';
import { CreateLandlordObjectDto } from './dto/landlord-objects.dto';
import { ApiLandlordObjectFullResponseType } from './landlord-objects.type';

interface LandlordObjectData {
  landlordObjectDto: CreateLandlordObjectDto;
  location: LocationEntity;
  telegramUser: TelegramUserEntity;
}
@Injectable()
export class LandlordObjectsSerializer {
  mapToDbData(landlordObjectData: LandlordObjectData): Partial<LandlordObjectEntity> {
    const { landlordObjectDto, location, telegramUser } = landlordObjectData;
    return {
      name: landlordObjectDto.name,
      address: landlordObjectDto.address,
      averageAge: landlordObjectDto.averageAge,
      comment: landlordObjectDto.comment,
      locationId: location.id,
      phoneNumber: landlordObjectDto.phoneNumber,
      preferredGender: landlordObjectDto.preferredGender,
      price: landlordObjectDto.price,
      showCouples: landlordObjectDto.showCouples,
      showWithAnimals: landlordObjectDto.showWithAnimals,
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
      location: landlordObject.location.area,
      address: landlordObject.address,
      subwayStations: landlordObject.subwayStations.map(station => station.station).join(', '),
      preferredGender: landlordObject.preferredGender,
      showCouples: landlordObject.showCouples,
      showWithAnimals: landlordObject.showWithAnimals,
      averageAge: landlordObject.averageAge,
      startArrivalDate: landlordObject.startArrivalDate,
      price: landlordObject.price,
      photoIds: JSON.stringify(landlordObject.photos.map(p => p.photoId)),
      comment: landlordObject.comment,
    };
  }
}
