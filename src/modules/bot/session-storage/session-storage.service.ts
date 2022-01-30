import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisAdapter } from '@satont/grammy-redis-storage';
import IORedis from 'ioredis';
import { lazySession } from 'grammy';
import { RedisConfigType } from '../../configuration/interfaces/configuration.types';
import {
  SessionDataInterface,
  SessionStorageInterface,
  StorageInterface,
} from './interfaces/session-storage.interface';

@Injectable()
export class SessionStorageService implements OnModuleInit {
  private redisInstance: IORedis.Redis;

  private storage: StorageInterface;

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    const redisConfig = this.configService.get('redis') as RedisConfigType;
    this.redisInstance = new IORedis(`redis://${redisConfig.host}:${redisConfig.port}`);
    this.storage = new RedisAdapter({ instance: this.redisInstance, ttl: undefined });
  }

  public getSession(): SessionStorageInterface {
    return lazySession({
      initial: this.getInitialSession.bind(this),
      storage: this.storage,
    });
  }

  private getInitialSession(): SessionDataInterface {
    return {
      type: undefined,
      gender: undefined,
    };
  }
}
