import { Bot } from 'grammy';
import { ignoreOld, sequentialize } from 'grammy-middlewares';
import { run } from '@grammyjs/runner';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { BotHandlersService } from '../handlers/bot-handlers.service';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { MyContext } from './interfaces/bot.interface';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot<MyContext>;

  constructor(
    private logger: LoggerService,
    private configService: ConfigService,

    private botHandlersService: BotHandlersService,
    private sessionStorageService: SessionStorageService,
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
    this.listenCommands();
    this.catchErrors();

    await this.bot.init();
    run(this.bot);

    this.logger.info(`Bot ${this.bot.botInfo.username} is up and running`);
  }

  private setMiddlewares(): void {
    this.bot.use(sequentialize()).use(ignoreOld()).use(this.sessionStorageService.getSession());
  }

  private listenCommands(): void {
    this.bot.command(['start'], this.botHandlersService.start);
  }

  private catchErrors(): void {
    this.bot.catch(this.logger.errorForBot.bind(this.logger));
  }
}
