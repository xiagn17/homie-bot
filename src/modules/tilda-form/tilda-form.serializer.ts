import { Injectable } from '@nestjs/common';
import { Renter } from '../../entities/users/Renter';
import { Location } from '../../entities/directories/Location';
import { RenterRequestDTO } from './tilda-form.dto';

@Injectable()
export class TildaFormSerializer {
  deserialize(renterRequestDTO: RenterRequestDTO, location: Location): Partial<Renter> {
    return {
      name: renterRequestDTO.name,
      gender: renterRequestDTO.gender,
      birthdayYear: renterRequestDTO.birthdayYear,
      phoneNumber: renterRequestDTO.phone,
      plannedArrival: renterRequestDTO.plannedArrivalDate,
      locationId: location.id,
      university: renterRequestDTO.university,
      preferences: renterRequestDTO.preferences,
      zodiacSign: renterRequestDTO.zodiacSign,
      socials: renterRequestDTO.socials,
      telegram: renterRequestDTO.telegram,
      requestId: renterRequestDTO.requestId,
      utmSource: renterRequestDTO.utmSource,
    };
  }
}
