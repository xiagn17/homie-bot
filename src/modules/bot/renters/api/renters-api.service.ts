import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RentersService } from '../../../api/renters/renters.service';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';
import {
  ApiRenterInfoDraft,
  ApiRenterInfo,
  ApiRenterFullInfo,
  ApiRenterInfoUpdateDraft,
} from '../../../api/renters/interfaces/renter-info.interface';
import { ApiRenterFilters } from '../../../api/renters/interfaces/renter-filters.interface';

export interface CreateRenterDataInterface {
  gender: GenderEnumType;
  chatId: string;
}
export interface UpdateRenterFiltersData extends Partial<ApiRenterFilters> {
  chatId: string;
}
export type UpdateRenterInfoData = ApiRenterInfoUpdateDraft;

@Injectable()
export class RentersApiService {
  constructor(
    private readonly rentersService: RentersService,

    private configService: ConfigService,
  ) {}

  async create({ gender, chatId }: CreateRenterDataInterface): Promise<void> {
    const botId = this.configService.get('bot.id') as string;
    await this.rentersService.createRenter({ gender, chatId, botId });
  }

  isRenterExists(chatId: string): Promise<boolean> {
    return this.rentersService.isUserRenter(chatId);
  }

  createInfo(info: ApiRenterInfoDraft): Promise<ApiRenterInfo> {
    return this.rentersService.createInfo(info);
  }

  isInfoExists(chatId: string): Promise<boolean> {
    return this.rentersService.isRenterInfoExists(chatId);
  }

  getRenterInfo(chatId: string): Promise<ApiRenterFullInfo | undefined> {
    return this.rentersService.getRenterInfo(chatId);
  }

  async updateRenterInfo(data: UpdateRenterInfoData): Promise<void> {
    await this.rentersService.updateRenterInfo(data);
  }

  getFilters(chatId: string): Promise<ApiRenterFilters> {
    return this.rentersService.getRenterFilters(chatId);
  }

  async updateFilters({ chatId, ...filters }: UpdateRenterFiltersData): Promise<ApiRenterFilters> {
    const renter = await this.rentersService.getRenterByChatId(chatId);
    return this.rentersService.updateRenterFilters({
      renterId: renter.id,
      ...filters,
    });
  }
}
