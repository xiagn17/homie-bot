import { Bot } from 'grammy';
import { sequentialize } from 'grammy-middlewares';
import { run } from '@grammyjs/runner';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { LoggerService } from '../../logger/logger.service';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { BotHandlersService } from './handlers/bot-handlers.service';
import { MyContext } from './interfaces/bot.interface';
import { BotMenusService } from './menus/bot-menus.service';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot<MyContext>;

  constructor(
    private logger: LoggerService,
    private configService: ConfigService,

    private botHandlersService: BotHandlersService,
    private sessionStorageService: SessionStorageService,
    private botMenusService: BotMenusService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    const token = this.configService.get('bot.token');
    this.bot = new Bot<MyContext>(token);

    this.logger.info('Starting the bot...');

    this.setMiddlewares();
    this.setConfig();
    this.listenCommands();
    this.listenMessages();
    this.catchErrors();

    await this.bot.init();
    run(this.bot);

    this.logger.info(`Bot ${this.bot.botInfo.username} is up and running`);
  }

  private setMiddlewares(): void {
    const menus = this.botMenusService.menus;
    this.bot
      .use(sequentialize())
      .use(hydrateReply)
      .use(this.sessionStorageService.getSession())
      .use(...menus);
  }

  private setConfig(): void {
    this.bot.api.config.use(parseMode('HTML'));
  }

  private listenCommands(): void {
    this.bot.command('start', this.botHandlersService.start);
  }

  private listenMessages(): void {
    this.bot.on('my_chat_member', _ctx => {
      // ctx.update - получу инфу о бане бота/рестарте
    });
  }

  private catchErrors(): void {
    this.bot.catch(this.logger.errorForBot.bind(this.logger));
  }
}
