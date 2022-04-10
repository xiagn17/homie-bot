import { Injectable } from '@nestjs/common';
import { CreateRenterInfoDto } from '../dto/renters.dto';
import { RenterInfoEntity } from '../entities/RenterInfo.entity';
import { ApiRenterFull } from '../interfaces/renters.type';
import { ApiRenterFullInfo, ApiRenterInfo } from '../interfaces/renter-info.interface';
import { RenterEntity } from '../entities/Renter.entity';

interface RenterInfoData {
  renterInfoDto: CreateRenterInfoDto;
  renter: RenterEntity;
}
@Injectable()
export class RenterInfosSerializer {
  mapToDbData(renterData: RenterInfoData): Partial<RenterInfoEntity> {
    const { renter, renterInfoDto } = renterData;
    return {
      name: renterInfoDto.name,
      birthdayYear: renterInfoDto.birthdayYear,
      phoneNumber: renterInfoDto.phoneNumber,
      zodiacSign: renterInfoDto.zodiacSign,
      socials: renterInfoDto.socials,
      lifestyle: renterInfoDto.lifestyle,
      profession: renterInfoDto.profession,
      about: renterInfoDto.about,
      photo: renterInfoDto.photo,
      renterId: renter.id,
    };
  }

  toResponse(renterInfo: RenterInfoEntity): ApiRenterInfo {
    return {
      about: renterInfo.about,
      birthdayYear: renterInfo.birthdayYear,
      lifestyle: renterInfo.lifestyle,
      name: renterInfo.name,
      phoneNumber: renterInfo.phoneNumber,
      profession: renterInfo.profession,
      renterId: renterInfo.renterId,
      socials: renterInfo.socials,
      zodiacSign: renterInfo.zodiacSign,
      photo: renterInfo.photo,
    };
  }

  toFullResponse(renterInfo: RenterInfoEntity, renter: ApiRenterFull): ApiRenterFullInfo {
    return {
      ...this.toResponse(renterInfo),
      gender: renter.gender,
      username: renter.username,
    };
  }
}
