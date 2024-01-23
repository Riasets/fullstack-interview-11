import { Module, OnModuleInit } from '@nestjs/common';
import { RedisModule } from './RedisModule';
import { RedisClient } from './RedisClient';
import { InjectRedis } from './InjectRedis.decorator';

@Module({
  imports: [RedisModule],
})
export class TestRedisModule implements OnModuleInit {
  constructor(@InjectRedis('default') private defaultRedis: RedisClient) {
  }

  async onModuleInit() {
    await this.clear(this.defaultRedis);
  }

  private async clear(redisClient: RedisClient) {
    await redisClient.flushdb();
  }
}
