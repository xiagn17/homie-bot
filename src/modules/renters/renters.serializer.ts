import { Injectable } from '@nestjs/common';
import { Renter } from '../../entities/users/Renter';
import { Location } from '../../entities/directories/Location';
import { TelegramUser } from '../../entities/users/TelegramUser';
import { MoneyRange } from '../../entities/directories/MoneyRange';
import { MatchesInfo } from '../../entities/matches/MatchesInfo';
import { CreateRenterDTO } from './renters.dto';
import { ApiRenterFullType, ApiRenterResponseType } from './renters.type';

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

  toResponse(fullRenter: Renter): ApiRenterResponseType {
    return {
      username: fullRenter.telegramUser.username ?? fullRenter.phoneNumber,
      name: fullRenter.name,
      gender: fullRenter.gender,
      birthdayYear: fullRenter.birthdayYear,
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
    };
  }

  // todo сделать интерфейс
  toResponseRenterExists(
    fullRenter:
      | {
          renter: Renter;
          matchesInfo: MatchesInfo | undefined;
        }
      | undefined,
  ): ApiRenterFullType {
    if (!fullRenter) {
      return { result: 'no', renter: undefined, ableMatches: 0 };
    }
    return {
      result: 'yes',
      renter: this.toResponse(fullRenter.renter),
      ableMatches: fullRenter.matchesInfo?.ableMatches,
    };
  }
}
