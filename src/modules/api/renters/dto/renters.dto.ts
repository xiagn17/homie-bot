import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RenterDraftInterface, GenderEnumType } from '../interfaces/renters.type';
import { RentersInfoLifestyleInterface } from '../interfaces/renters-info-lifestyle.interface';
import { ApiRenterInfoDraft, ApiRenterInfoUpdateDraft } from '../interfaces/renter-info.interface';
import { ApiRenterFiltersDraft } from '../interfaces/renter-filters.interface';
import { TelegramChatIdDTO } from '../../telegram-bot/dto/telegram-bot.dto';

export class CreateRenterDTO implements RenterDraftInterface {
  @IsString()
  chatId: string;

  @IsEnum(GenderEnumType)
  gender: GenderEnumType;

  @IsString()
  botId: string;
}

export class CreateRenterInfoDto implements ApiRenterInfoDraft {
  @IsString()
  chatId: string;

  @IsString()
  @IsOptional()
  botId?: string;

  @IsString()
  about: string;

  @IsString()
  birthdayYear: number;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  profession: string;

  @IsString()
  socials: string;

  @IsString()
  @IsOptional()
  zodiacSign: string | null;

  @IsNotEmpty()
  photo: string;

  lifestyle: RentersInfoLifestyleInterface;
}

export class UpdateRenterFiltersDto implements ApiRenterFiltersDraft {
  @IsString()
  renterId: string;
}

export class UpdateRenterInfoDto extends TelegramChatIdDTO implements ApiRenterInfoUpdateDraft {}
