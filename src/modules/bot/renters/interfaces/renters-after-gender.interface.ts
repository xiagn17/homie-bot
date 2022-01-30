import { MyContext } from '../../main/interfaces/bot.interface';
import { GenderEnumType } from '../../../api/renters/interfaces/renters.type';

export type RentersAfterGenderInterface = (gender: GenderEnumType, ctx: MyContext) => Promise<void>;
