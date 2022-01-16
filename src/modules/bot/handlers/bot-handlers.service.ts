import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { StartHandlerInterface } from './interfaces/bot-handlers.interface';

@Injectable()
export class BotHandlersService {
  constructor(private logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  start: StartHandlerInterface = async ctx => {
    const session = await ctx.session;
    session.counter++;
    await ctx.reply(`You have pressed /start ${session.counter} times`, {
      parse_mode: 'HTML' as const,
    });
  };
}
