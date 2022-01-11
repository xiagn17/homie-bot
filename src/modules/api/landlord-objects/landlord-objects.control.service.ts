import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { ObjectMatchesForLandlordService } from '../landlord-renter-matches/object-matches.for-landlord.service';
import { LandlordObjectsRepository } from './repositories/landlord-objects.repository';
import { ApproveLandlordObjectDto } from './dto/landlord-objects.dto';
import { LandlordObjectsService } from './landlord-objects.service';

@Injectable()
export class LandlordObjectsControlService {
  constructor(
    private logger: LoggerService,
    private connection: Connection,

    private telegramBotService: TelegramBotService,
    private flowXoService: FlowXoService,
    private landlordObjectsService: LandlordObjectsService,
    private objectMatchesForLandlordService: ObjectMatchesForLandlordService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async notificationApproveLandlordObject(): Promise<void> {
    const adminEntity = await this.telegramBotService.getAdmin();
    await this.flowXoService.notificationApproveLandlordObjectToAdmin({
      chatId: adminEntity.chatId,
      botId: adminEntity.botId,
    });
  }

  public getNextObjectIdToApprove(): Promise<string | undefined> {
    return this.connection.getCustomRepository(LandlordObjectsRepository).getNextObjectIdToApprove();
  }

  public async controlApprove(approveLandlordObjectDto: ApproveLandlordObjectDto): Promise<void> {
    if (!approveLandlordObjectDto.isApproved) {
      await this.connection
        .getCustomRepository(LandlordObjectsRepository)
        .archiveObject(approveLandlordObjectDto.id);
    }

    await this.connection
      .getCustomRepository(LandlordObjectsRepository)
      .approveObject(approveLandlordObjectDto.id);

    const landlordObject = await this.landlordObjectsService.getLandlordObject(approveLandlordObjectDto.id);
    await this.objectMatchesForLandlordService.matchObjectToRenters(landlordObject);
  }
}
