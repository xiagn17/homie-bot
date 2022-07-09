import { MenuFlavor } from '@grammyjs/menu/out/menu';
import { NextFunction } from 'grammy';
import { LocationsEnum, ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
import { MyContext } from '../../main/interfaces/bot.interface';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';

export type HandlerOnFiltersObjectTypes = (
  objectType: ObjectTypeEnum,
  ctx: MyContext & MenuFlavor,
) => Promise<void>;

export type HandlerOnFiltersLocation = (
  location: LocationsEnum,
  ctx: MyContext & MenuFlavor,
) => Promise<void>;

export type HandlerOnFiltersPriceQuestion = (ctx: MyContext) => Promise<void>;

export type HandlerOnGender = (
  gender: GenderEnumType,
  ctx: MyContext & MenuFlavor,
  next: NextFunction,
) => Promise<void>;

export type HandlerOnAfterOnboarding = (ctx: MyContext) => Promise<void>;
