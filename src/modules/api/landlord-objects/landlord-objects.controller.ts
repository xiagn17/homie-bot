import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QueueLandlordNotificationsProducerService } from '../../queues/landlord-notifications/producers/queue-landlord-notifications.producer.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { FlowXoService } from '../../flow-xo/flow-xo.service';
import { ApproveLandlordObjectDto, CreateLandlordObjectDto } from './dto/landlord-objects.dto';
import { LandlordObjectsService } from './landlord-objects.service';
import { LandlordObjectsControlService } from './landlord-objects.control.service';
import { ApiLandlordObjectFullResponseType } from './interfaces/landlord-objects.type';
import { LandlordObjectsSerializer } from './landlord-objects.serializer';
import { RenewLandlordObjectDto } from './dto/renew-landlord-object.dto';
import { ArchiveLandlordObjectDto } from './dto/archive-landlord-object.dto';

@Controller('landlord-objects')
export class LandlordObjectsController {
  constructor(
    private landlordObjectsService: LandlordObjectsService,
    private landlordObjectsControlService: LandlordObjectsControlService,
    private landlordObjectsSerializer: LandlordObjectsSerializer,

    private landlordNotificationsQueueService: QueueLandlordNotificationsProducerService,

    private telegramBotService: TelegramBotService,
    private flowXoService: FlowXoService,
  ) {}

  // todo[TECH] вынести next-approve-object и control в отдельный модуль admin
  @Get('/next-approve-object')
  async getNextObjectToApprove(): Promise<ApiLandlordObjectFullResponseType | null> {
    const landlordObjectId = await this.landlordObjectsControlService.getNextObjectIdToApprove();
    if (!landlordObjectId) {
      return null;
    }
    const landlordObject = await this.landlordObjectsService.getLandlordObject(landlordObjectId);
    return landlordObject && this.landlordObjectsSerializer.toFullResponse(landlordObject);
  }

  @Get('/has-user/:chatId')
  async hasUserObject(@Param('chatId') chatId: string): Promise<boolean> {
    const { chatId: adminChatId } = await this.telegramBotService.getAdmin();
    const { chatId: subAdminChatId } = await this.telegramBotService.getSubAdmin();
    if (adminChatId === chatId || subAdminChatId === chatId) {
      return false;
    }
    return this.landlordObjectsService.hasUserObject(chatId);
  }

  @Post()
  async createObject(@Body() landlordObjectDto: CreateLandlordObjectDto): Promise<void> {
    const { chatId: adminChatId } = await this.telegramBotService.getAdmin();
    const { chatId: subAdminChatId } = await this.telegramBotService.getSubAdmin();
    const landlordObject = await this.landlordObjectsService.createObject(landlordObjectDto);
    if (adminChatId === landlordObjectDto.chatId || subAdminChatId === landlordObjectDto.chatId) {
      await this.landlordObjectsControlService.controlApprove({ id: landlordObject.id, isApproved: true });
      return;
    } else {
      await this.landlordObjectsControlService.notificationApproveLandlordObject();
    }
  }

  @Post('/control')
  async controlObject(@Body() approveLandlordObjectDto: ApproveLandlordObjectDto): Promise<void> {
    const landlordObject = await this.landlordObjectsService.getLandlordObject(approveLandlordObjectDto.id);
    await this.landlordObjectsControlService.controlApprove(approveLandlordObjectDto);
    await this.flowXoService.notificationApproveAdminToLandlord(
      approveLandlordObjectDto.isApproved,
      landlordObject.telegramUser,
    );
    if (approveLandlordObjectDto.isApproved) {
      await this.landlordNotificationsQueueService.sendNotificationRenewObject(approveLandlordObjectDto.id);
    }
  }

  @Post('/renew')
  async renewObject(@Body() renewLandlordObjectDto: RenewLandlordObjectDto): Promise<void> {
    const landlordObjectId = await this.landlordObjectsService.renewObject(renewLandlordObjectDto);
    await this.landlordNotificationsQueueService.sendNotificationRenewObject(landlordObjectId);
  }

  @Post('/stop')
  async archiveObject(@Body() archiveLandlordObjectDto: ArchiveLandlordObjectDto): Promise<void> {
    await this.landlordObjectsService.archiveObject(archiveLandlordObjectDto);
  }
}
