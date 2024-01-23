import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClient } from './RedisClient';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_DEFAULT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RedisClient({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          db: configService.get('REDIS_DATABASE'),
        });
      },
    },
  ],
  exports: ['REDIS_DEFAULT'],
})
export class RedisModule implements OnModuleDestroy {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleDestroy() {
    const redisDefault: RedisClient = this.moduleRef.get('REDIS_DEFAULT');
    await redisDefault.disconnect();
  }
}
