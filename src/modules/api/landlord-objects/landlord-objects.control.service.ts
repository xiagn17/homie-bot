import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Logger } from '../../logger/logger.service';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { LandlordObjectsRepository } from '../../../repositories/landlord-objects/landlord-objects.repository';
import { QueueObjectRenterMatchesProducerService } from '../../queues/object-renter-matches/producers/queue-object-renter-matches.producer.service';
import { ApproveLandlordObjectDto } from './dto/landlord-objects.dto';

@Injectable()
export class LandlordObjectsControlService {
  constructor(
    private logger: Logger,
    private connection: Connection,

    private telegramBotService: TelegramBotService,
    private flowXoService: FlowXoService,
    private queueObjectRenterMatchesService: QueueObjectRenterMatchesProducerService,
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

    await this.queueObjectRenterMatchesService.pushJobCreateMatchesForObject(approveLandlordObjectDto.id);
  }
}
