import { Context } from 'grammy';
import { MySessionFlavour } from '../../session-storage/interfaces/session-storage.interface';

export type MyContext = Context & MySessionFlavour;
