import { Injectable } from '@nestjs/common';
import { TelegramUserEntity } from '../telegram-bot/entities/TelegramUser.entity';
import { RenterEntity } from './entities/Renter.entity';
import { CreateRenterDTO } from './dto/renters.dto';
import { ApiRenterFullType, ApiRenterResponseType } from './interfaces/renters.type';

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

  toResponseRenterExists(fullRenter: { renter?: RenterEntity }): ApiRenterFullType {
    if (!fullRenter.renter) {
      return { isRenter: 'no', renter: undefined };
    }
    return {
      isRenter: 'yes',
      renter: this.toResponse(fullRenter.renter),
    };
  }
}
