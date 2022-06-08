import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from '../../telegram-bot/entities/TelegramUser.entity';
import { RenterEntity } from '../entities/Renter.entity';
import { CreateRenterDTO } from '../dto/renters.dto';
import { ApiRenterFull, ApiRenterResponseType, ApiRenterSettings } from '../interfaces/renters.type';
import { RenterSettingsEntity } from '../entities/RenterSettings.entity';

interface RenterData {
  renterDto: CreateRenterDTO;
  telegramUser: TelegramUserEntity;
}
@Injectable()
export class RentersSerializer {
  mapToDbData(renterData: RenterData): Partial<RenterEntity> {
    const { renterDto, telegramUser } = renterData;
    return {
      gender: renterDto.gender,
      telegramUserId: telegramUser.id,
    };
  }

  toResponse(fullRenter: RenterEntity): ApiRenterResponseType {
    return {
      id: fullRenter.id,
      username: fullRenter.telegramUser.username ?? '',
      gender: fullRenter.gender,
    };
  }

  toResponseSettings(renterSettings: RenterSettingsEntity): ApiRenterSettings {
    return {
      inSearch: renterSettings.inSearch,
      renterId: renterSettings.renterId,
      subscriptionStarted: renterSettings.subscriptionStarted,
      subscriptionEnds: renterSettings.subscriptionEnds,
      subscriptionTrialStarted: renterSettings.subscriptionTrialStarted,
      subscriptionTrialEnds: renterSettings.subscriptionTrialEnds,
    };
  }

  toFullResponse(fullRenter: RenterEntity): ApiRenterFull {
    return {
      ...this.toResponse(fullRenter),
      settings: this.toResponseSettings(fullRenter.renterSettingsEntity),
    };
  }
}
