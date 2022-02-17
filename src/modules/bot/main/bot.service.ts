import { Bot, GrammyError, HttpError } from 'grammy';
import { run, sequentialize } from '@grammyjs/runner';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { limit } from '@grammyjs/ratelimiter';
import { hydrate } from '@grammyjs/hydrate';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { LoggerService } from '../../logger/logger.service';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { RedisConnectorService } from '../../redis-connector/redis-connector.service';
import { getSessionKey } from '../session-storage/helpers/get-session-key.helper';
import { MyContext } from './interfaces/bot.interface';
import { BotMiddlewaresService } from './middlewares/bot-middlewares.service';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot<MyContext>;

  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private redisConnectorService: RedisConnectorService,

    private sessionStorageService: SessionStorageService,
    private botMiddlewaresService: BotMiddlewaresService,
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
    this.listenMessages();
    this.catchErrors();

    await this.bot.init();
    const runner = run(this.bot);

    const stopRunner: () => void = () => runner.isRunning() && runner.stop();
    process.once('SIGINT', stopRunner);
    process.once('SIGTERM', stopRunner);

    this.logger.info(`Bot ${this.bot.botInfo.username} is up and running`);
  }

  private setMiddlewares(): void {
    const businessLogicMiddlewares = this.botMiddlewaresService.middlewares;
    this.bot
      .use(sequentialize(getSessionKey))
      .use(
        limit({
          timeFrame: 2000,
          limit: 3,
          storageClient: this.redisConnectorService.redis,
          onLimitExceeded: ctx => {
            ctx?.reply('Флуд-контроль: наш бот ленивый и не любит обрабатывать много сообщений за раз!');
          },
        }),
      )
      .use(hydrateReply)
      .use(hydrate())
      .use(this.sessionStorageService.getSession())
      .use(...businessLogicMiddlewares);
  }

  private setConfig(): void {
    const throttler = apiThrottler({ out: { maxConcurrent: 1, minTime: 500 } });
    this.bot.api.config.use(parseMode('HTML')).use(throttler);
  }

  private listenMessages(): void {
    this.bot.on('my_chat_member', _ctx => {
      // ctx.update - получу инфу о бане бота/рестарте
    });
    this.bot.on('callback_query:data', async ctx => {
      this.logger.info('Unknown button event with payload', ctx.callbackQuery.data);
      await ctx.answerCallbackQuery();
    });
  }

  private catchErrors(): void {
    this.bot.catch(err => {
      const ctx = err.ctx;
      this.logger.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        this.logger.error('Error in request:', e);
      } else if (e instanceof HttpError) {
        this.logger.error('Could not contact Telegram:', e);
      } else {
        this.logger.error('Unknown error:', e);
      }
      console.error(e);
    });
  }
}
