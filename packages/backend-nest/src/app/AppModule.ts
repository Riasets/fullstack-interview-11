import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/DatabaseModule';
import { HealthController } from './http/HealthController';
import { RedisModule } from '../redis/RedisModule';
import { EmailVerificationsController } from './http/EmailVerificationsController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    DatabaseModule,
    RedisModule,
  ],
  controllers: [
    HealthController,
    EmailVerificationsController,
  ],
})
export class AppModule {}
