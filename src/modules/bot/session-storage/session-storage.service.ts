import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisAdapter } from '@satont/grammy-redis-storage';
import { lazySession } from 'grammy';
import { RedisConnectorService } from '../../redis-connector/redis-connector.service';
import {
  SessionDataInterface,
  SessionStorageInterface,
  StorageInterface,
} from './interfaces/session-storage.interface';
import { getSessionKey } from './helpers/get-session-key.helper';

@Injectable()
export class SessionStorageService implements OnModuleInit {
  private storage: StorageInterface;

  constructor(private redisConnectorService: RedisConnectorService) {}

  onModuleInit(): void {
    const redisInstance = this.redisConnectorService.redis;
    this.storage = new RedisAdapter({ instance: redisInstance, ttl: undefined });
  }

  public getSession(): SessionStorageInterface {
    return lazySession({
      initial: this.getInitialSession.bind(this),
      storage: this.storage,
      getSessionKey: getSessionKey,
    });
  }

  private getInitialSession(): SessionDataInterface {
    return {
      type: undefined,
      renter: {
        infoStepsData: {},
        infoFillFrom: undefined,
        infoStep: undefined,
        infoStepUpdate: false,
        viewedObjects: 0,
        firstMenuTip: false,
      },
      landlord: {
        firstTip: false,
        objectStepsData: {},
      },
    };
  }
}
