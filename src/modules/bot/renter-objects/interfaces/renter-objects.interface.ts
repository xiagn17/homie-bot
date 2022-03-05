import { MyContext } from '../../main/interfaces/bot.interface';
import { LandlordObjectEntity } from '../../../api/landlord-objects/entities/LandlordObject.entity';

export type SendNextObject = (ctx: MyContext) => Promise<void>;
export type GetContact = (objectId: string, ctx: MyContext) => Promise<boolean>;
export type SendObjectContact = (object: LandlordObjectEntity, ctx: MyContext) => Promise<void>;
export type SendRenterInfoNotExists = (objectId: string, ctx: MyContext) => Promise<void>;
export type SendObjectRequest = (objectId: string, ctx: MyContext) => Promise<void>;
