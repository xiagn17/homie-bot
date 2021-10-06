import { Injectable } from '@nestjs/common';
import { Renter } from '../../entities/users/Renter';
import { RenterMatch } from '../../entities/matches/RenterMatch';
import { ApiRenterMatchResponseType, MatchDataType } from './renter-matches.type';

@Injectable()
export class RenterMatchesSerializer {
  toMatchedRenter(fullRenter: Renter): ApiRenterMatchResponseType {
    const age = new Date().getFullYear() - Number(fullRenter.birthdayYear);
    return {
      username: fullRenter.telegramUser.username,
      name: fullRenter.name,
      gender: fullRenter.gender,
      age: age,
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

  prepareMatchData(matchedRenters: [Renter, Renter], match: RenterMatch): MatchDataType[] {
    return matchedRenters.map((renter, i, renters) => {
      return {
        targetChatId: renter.telegramUser.chatId,
        matchedRenter: this.toMatchedRenter(renters[i + 1] ?? renters[i - 1]),
        matchId: match.id,
      };
    });
  }
}
