import { Injectable } from '@nestjs/common';
import { LocationEntity } from '../directories/entities/Location.entity';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { MoneyRangeEntity } from '../directories/entities/MoneyRange.entity';
import { RenterEntity } from './entities/Renter.entity';
import { MatchesInfoEntity } from './entities/MatchesInfo.entity';
import { CreateRenterDTO } from './dto/renters.dto';
import { ApiRenterFullType, ApiRenterResponseType } from './interfaces/renters.type';

interface RenterData {
  renterDto: CreateRenterDTO;
  location: LocationEntity;
  moneyRange: MoneyRangeEntity;
  telegramUser: TelegramUserEntity;
}
@Injectable()
export class RentersSerializer {
  mapToDbData(renterData: RenterData): Partial<RenterEntity> {
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
      withAnimals: renterDto.withAnimals,
    };
  }

  toResponse(fullRenter: RenterEntity): ApiRenterResponseType {
    return {
      id: fullRenter.id,
      username: fullRenter.telegramUser.username ?? '',
      name: fullRenter.name,
      gender: fullRenter.gender,
      birthdayYear: fullRenter.birthdayYear,
      age: new Date().getFullYear() - Number(fullRenter.birthdayYear),
      phone: fullRenter.phoneNumber,
      moneyRange: fullRenter.moneyRange.range,
      plannedArrivalDate: fullRenter.plannedArrival,
      location: fullRenter.location.area,
      subwayStations: fullRenter.subwayStations.map(station => station.station).join(', '),
      zodiacSign: fullRenter.zodiacSign ?? '-',
      university: fullRenter.university ?? '-',
      interests: fullRenter.interests.map(interest => interest.interest).join(', '),
      preferences: fullRenter.preferences ?? '-',
      socials: fullRenter.socials,
      withAnimals: fullRenter.withAnimals,
      liveWithAnotherGender: fullRenter.liveWithAnotherGender,
    };
  }

  toResponseRenterExists(
    fullRenter:
      | {
          renter: RenterEntity;
          matchesInfo: MatchesInfoEntity;
        }
      | undefined,
  ): ApiRenterFullType {
    if (!fullRenter) {
      return { isRenter: 'no', renter: undefined, ableMatches: 0 };
    }
    return {
      isRenter: 'yes',
      renter: this.toResponse(fullRenter.renter),
      ableMatches: fullRenter.matchesInfo.ableMatches,
    };
  }
}
