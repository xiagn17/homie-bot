import { Context } from 'grammy';
import type { ParseModeContext } from '@grammyjs/parse-mode';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { MySessionFlavour } from '../../session-storage/interfaces/session-storage.interface';

export type MyContext = HydrateFlavor<Context> & MySessionFlavour & ParseModeContext;
