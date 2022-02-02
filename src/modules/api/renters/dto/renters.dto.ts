import { IsEnum, IsString } from 'class-validator';
import { RenterInterface, GenderEnumType } from '../interfaces/renters.type';

export class CreateRenterDTO implements RenterInterface {
  @IsString()
  chatId: string;

  @IsEnum(GenderEnumType)
  gender: GenderEnumType;
}
