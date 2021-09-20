import { Injectable } from '@nestjs/common';
import { Renter } from '../../entities/users/Renter';
import { Location } from '../../entities/directories/Location';
import { TelegramUser } from '../../entities/users/TelegramUser';
import { MoneyRange } from '../../entities/directories/MoneyRange';
import { CreateRenterDTO } from './renters.dto';
import { RenterType } from './renters.type';

interface RenterData {
  renterDto: CreateRenterDTO;
  location: Location;
  moneyRange: MoneyRange;
  telegramUser: TelegramUser;
}
@Injectable()
export class RentersSerializer {
  mapToDbData(renterData: RenterData): Partial<Renter> {
    const { renterDto, location, moneyRange, telegramUser } = renterData;
    return {
      name: renterDto.name,
      gender: renterDto.gender,
      birthdayYear: renterDto.birthdayYear,
      phoneNumber: renterDto.phone,
      plannedArrival: renterDto.plannedArrivalDate.toISOString(),
      university: renterDto.university,
      preferences: renterDto.preferences ?? null,
      zodiacSign: renterDto.zodiacSign ?? null,
      socials: renterDto.socials,
      moneyRangeId: moneyRange.id,
      locationId: location.id,
      telegramUserId: telegramUser.id,
      liveWithAnotherGender: renterDto.liveWithAnotherGender,
    };
  }

  toResponse(fullRenter: Renter): RenterType {
    return {
      chatId: fullRenter.telegramUser.chatId,
      name: fullRenter.name,
      gender: fullRenter.gender,
      birthdayYear: fullRenter.birthdayYear,
      phone: fullRenter.phoneNumber,
      moneyRange: fullRenter.moneyRange.range,
      plannedArrivalDate: new Date(fullRenter.plannedArrival),
      location: fullRenter.location.area,
      subwayStations: fullRenter.subwayStations.map(station => station.station),
      zodiacSign: fullRenter.zodiacSign ?? undefined,
      university: fullRenter.university ?? undefined,
      interests: fullRenter.interests.map(interest => interest.interest),
      preferences: fullRenter.preferences ?? undefined,
      socials: fullRenter.socials,
      liveWithAnotherGender: fullRenter.liveWithAnotherGender,
    };
  }
}
