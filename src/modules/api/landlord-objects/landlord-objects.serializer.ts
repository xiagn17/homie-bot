import { Injectable } from '@nestjs/common';
import { LocationEntity } from '../../../entities/directories/Location.entity';
import { TelegramUserEntity } from '../../../entities/users/TelegramUser.entity';
import { LandlordObjectEntity } from '../../../entities/landlord-objects/LandlordObject.entity';
import { CreateLandlordObjectDto } from './landlord-objects.dto';

interface LandlordObjectData {
  landlordObjectDto: CreateLandlordObjectDto;
  location: LocationEntity;
  telegramUser: TelegramUserEntity;
}
@Injectable()
export class LandlordObjectsSerializer {
  mapToDbData(renterData: LandlordObjectData): Partial<LandlordObjectEntity> {
    const { landlordObjectDto, location, telegramUser } = renterData;
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

  // toResponse(fullRenter: RenterEntity): ApiRenterResponseType {
  //   return {
  //     username: fullRenter.telegramUser.username ?? fullRenter.phoneNumber,
  //     name: fullRenter.name,
  //     gender: fullRenter.gender,
  //     birthdayYear: fullRenter.birthdayYear,
  //     phone: fullRenter.phoneNumber,
  //     moneyRange: fullRenter.moneyRange.range,
  //     plannedArrivalDate: fullRenter.plannedArrival,
  //     location: fullRenter.location.area,
  //     subwayStations: fullRenter.subwayStations.map(station => station.station).join(', '),
  //     zodiacSign: fullRenter.zodiacSign ?? '-',
  //     university: fullRenter.university ?? '-',
  //     interests: fullRenter.interests.map(interest => interest.interest).join(', '),
  //     preferences: fullRenter.preferences ?? '-',
  //     socials: fullRenter.socials,
  //     withAnimals: fullRenter.withAnimals,
  //   };
  // }
}
