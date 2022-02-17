import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisConfigType } from '../configuration/interfaces/configuration.types';

@Injectable()
export class RedisConnectorService {
  private readonly redisInstance: IORedis.Redis;

  constructor(private configService: ConfigService) {
    const redisConfig = this.configService.get('redis') as RedisConfigType;
    this.redisInstance = new IORedis(`redis://${redisConfig.host}:${redisConfig.port}`);
  }

  get redis(): IORedis.Redis {
    return this.redisInstance;
  }
}
