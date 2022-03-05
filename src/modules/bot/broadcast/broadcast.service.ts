import { Injectable, OnModuleInit } from '@nestjs/common';
import { Api, RawApi } from 'grammy';
import {
  InputFile,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaPhoto,
  InputMediaVideo,
} from 'grammy/out/platform.node';
import { AbortSignal } from 'grammy/out/shim.node';
import { Other } from 'grammy/out/core/api';
import { ApiObjectResponse } from '../../api/landlord-objects/interfaces/landlord-objects.type';
import { AdminTextsService } from '../admin/texts/admin-texts.service';
import { AdminKeyboardsService } from '../admin/keyboards/admin-keyboards.service';
import { BotInstanceService } from '../main/instance/bot-instance.service';
import { LandlordsTextsService } from '../landlords/texts/landlords-texts.service';
import { ApiRenterFullInfo } from '../../api/renters/interfaces/renter-info.interface';
import { RentersTextsService } from '../renters/texts/renters-texts.service';
import { LandlordRentersKeyboardsService } from '../landlord-renters/keyboards/landlord-renters-keyboards.service';
import { LandlordObjectEntity } from '../../api/landlord-objects/entities/LandlordObject.entity';
import { EMOJI_CELEBRATE } from '../constants/emoji';
import { RenterObjectsTextsService } from '../renter-objects/texts/renter-objects-texts.service';
import { RentersObjectsKeyboardsService } from '../renter-objects/keyboards/renters-objects-keyboards.service';
import { LandlordsKeyboardsService } from '../landlords/keyboards/landlords-keyboards.service';

interface ForwardOptions {
  chatId: string;
}

@Injectable()
export class BroadcastService implements OnModuleInit {
  private api: Api<RawApi>;

  constructor(
    private readonly botInstanceService: BotInstanceService,

    private readonly adminTextsService: AdminTextsService,
    private readonly adminKeyboardsService: AdminKeyboardsService,

    private readonly landlordsTextsService: LandlordsTextsService,
    private readonly landlordsKeyboardsService: LandlordsKeyboardsService,

    private readonly rentersTextsService: RentersTextsService,

    private readonly landlordRentersKeyboardsService: LandlordRentersKeyboardsService,

    private readonly renterObjectsTextsService: RenterObjectsTextsService,
    private readonly renterObjectsKeyboardsService: RentersObjectsKeyboardsService,
  ) {}

  onModuleInit(): void {
    this.api = this.botInstanceService.bot.api;
  }

  async sendModerationMessageToAdmin(object: ApiObjectResponse, { chatId }: ForwardOptions): Promise<void> {
    const text = this.adminTextsService.getObjectModerationText(object);
    const keyboard = this.adminKeyboardsService.getAdminModerationKeyboard(object.id);
    const photos: InputMediaPhoto[] = object.photoIds.map(p => ({
      type: 'photo',
      media: p,
    }));
    await this.sendMediaGroup(chatId, photos);
    await this.sendMessage(chatId, text, {
      reply_markup: keyboard,
    });
  }

  async sendModerationDecisionToLandlord(isApproved: boolean, { chatId }: ForwardOptions): Promise<void> {
    const text = this.landlordsTextsService.getModerationDecisionText(isApproved);
    await this.sendMessage(chatId, text);
  }

  async sendRenterInfoToLandlord(renterInfo: ApiRenterFullInfo, { chatId }: ForwardOptions): Promise<void> {
    const text = this.rentersTextsService.getRenterInfoText(renterInfo);
    const keyboard = this.landlordRentersKeyboardsService.getRenterActionsKeyboard(renterInfo.renterId);
    await this.sendPhoto(chatId, renterInfo.photo, {
      caption: text,
      reply_markup: keyboard,
    });
  }

  async sendLandlordContactsToApprovedRenter(
    object: LandlordObjectEntity,
    { chatId }: ForwardOptions,
  ): Promise<void> {
    const contactsText = this.renterObjectsTextsService.getContactObjectText(object);
    await this.sendMessage(chatId, EMOJI_CELEBRATE);

    const tgUsername =
      !object.isAdmin && object.telegramUser.username ? object.telegramUser.username : undefined;
    await this.sendMessage(chatId, contactsText, {
      reply_markup: this.renterObjectsKeyboardsService.getContactsKeyboard(object.id, true, tgUsername),
    });
  }

  async sendSuccessfulPaidContacts(contactsNumber: number, { chatId }: ForwardOptions): Promise<void> {
    const text = this.rentersTextsService.getSuccessfulPaidContactsText(contactsNumber);
    await this.sendMessage(chatId, text);
  }

  async sendSuccessfulPaidPrivateHelper({ chatId }: ForwardOptions): Promise<void> {
    const text = this.rentersTextsService.getSuccessfulPrivateHelperText();
    await this.sendMessage(chatId, text);
  }

  async sendSuccessfulPaidPrivateHelperToAdmin(
    username: string | null,
    { chatId }: ForwardOptions,
  ): Promise<void> {
    const text = this.rentersTextsService.getSuccessfulPrivateHelperToAdminText(username);
    await this.sendMessage(chatId, text);
  }

  async sendRenewObjectToLandlord(object: ApiObjectResponse, { chatId }: ForwardOptions): Promise<void> {
    const text = this.landlordsTextsService.getRenewObjectText(object);
    const keyboard = this.landlordsKeyboardsService.getObjectRenewKeyboard(object.id);
    await this.sendMessage(chatId, text, {
      reply_markup: keyboard,
    });
  }

  async sendNewObjectToRenter(object: ApiObjectResponse, { chatId }: ForwardOptions): Promise<void> {
    try {
      await this.sendMediaGroup(
        chatId,
        object.photoIds.map(id => ({
          type: 'photo',
          media: id,
        })),
      );
    } catch (e) {
      console.error(e);
      await this.sendMessage(chatId, 'К сожалению, фотографии не были загружены.');
    }

    const text = this.renterObjectsTextsService.getObjectText(object);
    const keyboard = this.renterObjectsKeyboardsService.getObjectsKeyboard(object.id, true);
    await this.sendMessage(chatId, text, {
      reply_markup: keyboard,
    });
  }

  private async sendMessage(
    chat_id: number | string,
    text: string,
    other?: Other<RawApi, 'sendMessage', 'text'>,
    signal?: AbortSignal,
  ): Promise<import('@grammyjs/types/message').Message.TextMessage | void> {
    try {
      return await this.api.sendMessage(chat_id, text, other, signal);
    } catch (e) {
      console.log(
        e?.error_code === 403 ? `user ${chat_id} blocked the bot` : 'unknown error while sending message',
      );
    }
  }

  private async sendPhoto(
    chat_id: number | string,
    photo: InputFile | string,
    other?: Other<RawApi, 'sendPhoto', 'photo'>,
    signal?: AbortSignal,
  ): Promise<import('@grammyjs/types/message').Message.PhotoMessage | void> {
    try {
      return await this.api.sendPhoto(chat_id, photo, other, signal);
    } catch (e) {
      console.log(
        e?.error_code === 403 ? `user ${chat_id} blocked the bot` : 'unknown error while sending message',
      );
    }
  }

  private async sendMediaGroup(
    chat_id: number | string,
    media: readonly (InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo)[],
    other?: Other<RawApi, 'sendMediaGroup', 'media'>,
    signal?: AbortSignal,
  ): Promise<
    | (
        | import('@grammyjs/types/message').Message.PhotoMessage
        | import('@grammyjs/types/message').Message.AudioMessage
        | import('@grammyjs/types/message').Message.DocumentMessage
        | import('@grammyjs/types/message').Message.VideoMessage
      )[]
    | void
  > {
    try {
      return await this.api.sendMediaGroup(chat_id, media, other, signal);
    } catch (e) {
      console.log(
        e?.error_code === 403 ? `user ${chat_id} blocked the bot` : 'unknown error while sending message',
      );
    }
  }
}
