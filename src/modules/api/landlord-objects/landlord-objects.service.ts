import { Injectable } from '@nestjs/common';
import { Any, Connection } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { LocationEntity } from '../../../entities/directories/Location.entity';
import { SubwayStationEntity } from '../../../entities/directories/SubwayStation.entity';
import { RentersRepository } from '../../../repositories/users/renters.repository';
import { RenterEntity } from '../../../entities/renters/Renter.entity';
import { TelegramUserEntity } from '../../../entities/users/TelegramUser.entity';
import { MatchesInfoRepository } from '../../../repositories/matches/matchesInfo.repository';
import { MatchesInfoEntity } from '../../../entities/renters/MatchesInfo.entity';
import { LandlordObjectEntity } from '../../../entities/landlord-objects/LandlordObject.entity';
import { LandlordObjectsRepository } from '../../../repositories/landlord-objects/landlord-objects.repository';
import { LandlordObjectPhotoEntity } from '../../../entities/landlord-objects/LandlordObjectPhoto.entity';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { CreateLandlordObjectDto } from './landlord-objects.dto';

@Injectable()
export class LandlordObjectsService {
  constructor(
    private logger: Logger,
    private connection: Connection,

    private landlordObjectsSerializer: LandlordObjectsSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async getRenterByChatId(
    chatId: string,
  ): Promise<{ renter: RenterEntity; matchesInfo: MatchesInfoEntity } | undefined> {
    const renter = await this.connection.getCustomRepository(RentersRepository).getByChatId(chatId);
    if (!renter) {
      return undefined;
    }
    const matchesInfo = await this.connection
      .getCustomRepository(MatchesInfoRepository)
      .getMatchesInfoByRenterId(renter.id);
    return { renter, matchesInfo };
  }

  public getRenterByPhone(phoneNumber: string): Promise<RenterEntity | undefined> {
    return this.connection.getCustomRepository(RentersRepository).getByPhone(phoneNumber);
  }

  public createObject(landlordObjectDto: CreateLandlordObjectDto): Promise<LandlordObjectEntity> {
    return this.connection.transaction<LandlordObjectEntity>(async manager => {
      const telegramUser = await manager
        .getRepository(TelegramUserEntity)
        .findOneOrFail({ chatId: landlordObjectDto.chatId });
      const location = await manager
        .getRepository(LocationEntity)
        .findOneOrFail({ area: landlordObjectDto.location });
      const subwayStations = await manager
        .getRepository(SubwayStationEntity)
        .find({ station: Any(landlordObjectDto.subwayStations) });

      const landlordObjectDbData = this.landlordObjectsSerializer.mapToDbData({
        landlordObjectDto,
        location,
        telegramUser,
      });
      const relationEntities = {
        subwayStations,
      };

      const landlordObjectEntity = await manager
        .getCustomRepository(LandlordObjectsRepository)
        .createWithRelations(landlordObjectDbData, relationEntities);

      const photoEntitiesCreatePromise = landlordObjectDto.photoUrls.map(photoUrl =>
        manager.save(
          manager.getRepository(LandlordObjectPhotoEntity).create({
            photoUrl,
            landlordObjectId: landlordObjectEntity.id,
          }),
        ),
      );
      await Promise.all(photoEntitiesCreatePromise);

      return manager.getCustomRepository(LandlordObjectsRepository).getFullObject(landlordObjectEntity.id);
    });
  }
}
