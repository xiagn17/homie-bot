import { Injectable } from '@nestjs/common';
import { Any, Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '../logger/logger.service';
import { Renter } from '../../entities/users/Renter';
import { MoneyRange } from '../../entities/directories/MoneyRange';
// import { Location } from '../../entities/directories/Location';
import { RenterRequest } from './tilda-form.dto';

@Injectable()
export class TildaFormService {
  constructor(
    private logger: Logger,

    @InjectRepository(Renter)
    private renterRepository: Repository<Renter>,

    private connection: Connection,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  // заворачиваем в транзакцию
  processRenter(data: RenterRequest): Promise<void> {
    return this.connection.transaction(async manager => {
      const renter = await this.createRenter(data);

      const moneyRanges = await manager.getRepository(MoneyRange).find({ range: Any(data.moneyRange) });

      // ПЕРЕДЕЛАТЬ location на 1 к 1
      // const moneyRanges = await this.entityManager.getRepository(Location).find({ area: Any(data.moneyRange) });

      await this.renterRepository
        .createQueryBuilder('renter')
        .relation('moneyRanges')
        .of(renter.id)
        .add(moneyRanges);

      await this.renterRepository
        .createQueryBuilder('renter')
        .relation('locations')
        .of(renter.id)
        .add(data.location);

      await this.renterRepository
        .createQueryBuilder('renter')
        .relation('subwayStations')
        .of(renter.id)
        .add(data.subwayStations);

      await this.renterRepository
        .createQueryBuilder('renter')
        .relation('interests')
        .of(renter.id)
        .add(data.interests);

      console.log(`new renter - `, renter);
    });
  }

  async createRenter(data: RenterRequest): Promise<Renter> {
    const dataForRenter = {
      name: data.name,
      gender: data.gender,
      birthdayYear: data.birthdayYear,
      phoneNumber: data.phone,
      plannedArrival: data.plannedArrivalDate,
      university: data.university,
      preferences: data.preferences,
      zodiacSign: data.zodiacSign,
      socials: data.socials,
      telegram: data.telegram,
      requestId: data.requestId,
      utmSource: data.utmSource,
    };
    return this.renterRepository.save(this.renterRepository.create(dataForRenter));
  }
}
