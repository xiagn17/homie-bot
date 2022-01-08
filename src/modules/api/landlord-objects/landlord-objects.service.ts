import { Injectable } from '@nestjs/common';
import { Any, Connection, EntityManager } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { LocationEntity } from '../../../entities/directories/Location.entity';
import { SubwayStationEntity } from '../../../entities/directories/SubwayStation.entity';
import { TelegramUserEntity } from '../../../entities/users/TelegramUser.entity';
import { LandlordObjectsRepository } from '../../../repositories/landlord-objects/landlord-objects.repository';
import { LandlordObjectPhotoEntity } from '../../../entities/landlord-objects/LandlordObjectPhoto.entity';
import { LandlordObjectEntity } from '../../../entities/landlord-objects/LandlordObject.entity';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { CreateLandlordObjectDto } from './dto/landlord-objects.dto';
import { RenewLandlordObjectDto } from './dto/renew-landlord-object.dto';
import { ArchiveLandlordObjectDto } from './dto/archive-landlord-object.dto';

@Injectable()
export class LandlordObjectsService {
  constructor(
    private logger: Logger,
    private connection: Connection,

    private landlordObjectsSerializer: LandlordObjectsSerializer,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public createObject(landlordObjectDto: CreateLandlordObjectDto): Promise<LandlordObjectEntity> {
    return this.connection.transaction(async manager => {
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

      const photoEntitiesCreatePromise = landlordObjectDto.photoIds.map(photoId =>
        manager.save(
          manager.getRepository(LandlordObjectPhotoEntity).create({
            photoId,
            landlordObjectId: landlordObjectEntity.id,
          }),
        ),
      );
      await Promise.all(photoEntitiesCreatePromise);

      return this.getLandlordObject(landlordObjectEntity.id, manager);
    });
  }

  getLandlordObject(
    id: string,
    entityManager: EntityManager = this.connection.manager,
  ): Promise<LandlordObjectEntity> {
    return entityManager.getCustomRepository(LandlordObjectsRepository).getFullObject(id);
  }

  async hasUserObject(chatId: string): Promise<boolean> {
    try {
      await this.connection.getCustomRepository(LandlordObjectsRepository).getByChatId(chatId);
      return true;
    } catch (e) {
      return false;
    }
  }

  async renewObject(renewLandlordObjectDto: RenewLandlordObjectDto): Promise<string> {
    const landlordObject = (
      await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .getByChatId(renewLandlordObjectDto.chatId)
    )[0];
    await this.connection.getCustomRepository(LandlordObjectsRepository).renewObject(landlordObject.id);
    return landlordObject.id;
  }

  async archiveObject(archiveLandlordObjectDto: ArchiveLandlordObjectDto): Promise<void> {
    const landlordObject = (
      await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .getByChatId(archiveLandlordObjectDto.chatId)
    )[0];
    await this.connection.getCustomRepository(LandlordObjectsRepository).archiveObject(landlordObject.id);
  }
}
