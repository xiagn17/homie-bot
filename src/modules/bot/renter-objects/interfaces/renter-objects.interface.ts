import { MyContext } from '../../main/interfaces/bot.interface';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';

export type SendNextObject = (ctx: MyContext) => Promise<void>;
export type SendObject = (object: ApiObjectResponse, ctx: MyContext) => Promise<void>;
export type SendRenterInfoNotExists = (objectId: string, ctx: MyContext) => Promise<void>;
export type SendObjectRequest = (objectId: string, isInfoExist: boolean, ctx: MyContext) => Promise<boolean>;
